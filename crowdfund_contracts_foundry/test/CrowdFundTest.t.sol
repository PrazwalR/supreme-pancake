// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {CrowdFund} from "../src/CrowdFund.sol";
import {CrowdFundScript} from "../script/DeployCrowdFund.s.sol";

// Helper contract to test failed transfers
contract RejectETH {
    receive() external payable {
        revert("Rejecting ETH");
    }
}

contract CrowdFundTest is Test {
    CrowdFund public crowdFund;
    address public campaignOwner = makeAddr("campaignOwner");
    address public donor1 = makeAddr("donor1");
    address public donor2 = makeAddr("donor2");

    uint256 constant TARGET_AMOUNT = 10 ether;
    uint256 constant DONATION_AMOUNT = 1 ether;
    string constant TITLE = "Test Campaign";
    string constant DESCRIPTION = "A test crowdfunding campaign";
    string constant IMAGE_URL = "https://example.com/image.jpg";

    function setUp() public {
        crowdFund = new CrowdFund();

        // Give test accounts some ETH
        vm.deal(campaignOwner, 100 ether);
        vm.deal(donor1, 100 ether);
        vm.deal(donor2, 100 ether);
    }

    function testCreateCampaign() public {
        uint256 deadline = block.timestamp + 30 days;

        vm.prank(campaignOwner);
        uint256 campaignId =
            crowdFund.createCampaign(campaignOwner, TITLE, DESCRIPTION, TARGET_AMOUNT, deadline, IMAGE_URL);

        assertEq(campaignId, 0);
        assertEq(crowdFund.numberOfCampaigns(), 1);

        CrowdFund.Campaign memory campaign = crowdFund.getCampaign(campaignId);
        assertEq(campaign.owner, campaignOwner);
        assertEq(campaign.title, TITLE);
        assertEq(campaign.description, DESCRIPTION);
        assertEq(campaign.target, TARGET_AMOUNT);
        assertEq(campaign.deadline, deadline);
        assertEq(campaign.amountCollected, 0);
        assertEq(campaign.image, IMAGE_URL);
    }

    function testCreateCampaignWithPastDeadline() public {
        // Set block timestamp to a specific value, then use a deadline before it
        uint256 currentTime = 1000000;
        vm.warp(currentTime);
        uint256 pastDeadline = currentTime - 1 days;

        vm.prank(campaignOwner);
        vm.expectRevert("Deadline must be in the future.");
        crowdFund.createCampaign(campaignOwner, TITLE, DESCRIPTION, TARGET_AMOUNT, pastDeadline, IMAGE_URL);
    }

    function testDonateToCampaign() public {
        uint256 deadline = block.timestamp + 30 days;
        uint256 campaignOwnerInitialBalance = campaignOwner.balance;

        // Create campaign
        vm.prank(campaignOwner);
        uint256 campaignId =
            crowdFund.createCampaign(campaignOwner, TITLE, DESCRIPTION, TARGET_AMOUNT, deadline, IMAGE_URL);

        // Donate to campaign
        vm.prank(donor1);
        crowdFund.donateToCampaign{value: DONATION_AMOUNT}(campaignId);

        // Check campaign was updated
        CrowdFund.Campaign memory campaign = crowdFund.getCampaign(campaignId);
        assertEq(campaign.amountCollected, DONATION_AMOUNT);

        // Check donor was recorded
        address[] memory donators = crowdFund.getDonators(campaignId);
        assertEq(donators.length, 1);
        assertEq(donators[0], donor1);

        // Check funds were transferred to campaign owner
        assertEq(campaignOwner.balance, campaignOwnerInitialBalance + DONATION_AMOUNT);
    }

    function testMultipleDonations() public {
        uint256 deadline = block.timestamp + 30 days;

        // Create campaign
        vm.prank(campaignOwner);
        uint256 campaignId =
            crowdFund.createCampaign(campaignOwner, TITLE, DESCRIPTION, TARGET_AMOUNT, deadline, IMAGE_URL);

        // Multiple donations
        vm.prank(donor1);
        crowdFund.donateToCampaign{value: DONATION_AMOUNT}(campaignId);

        vm.prank(donor2);
        crowdFund.donateToCampaign{value: 2 ether}(campaignId);

        vm.prank(donor1);
        crowdFund.donateToCampaign{value: 0.5 ether}(campaignId);

        // Check total amount collected
        CrowdFund.Campaign memory campaign = crowdFund.getCampaign(campaignId);
        assertEq(campaign.amountCollected, 3.5 ether);

        // Check all donors recorded
        address[] memory donators = crowdFund.getDonators(campaignId);
        assertEq(donators.length, 3);
        assertEq(donators[0], donor1);
        assertEq(donators[1], donor2);
        assertEq(donators[2], donor1);
    }

    function testDonationToNonExistentCampaign() public {
        vm.prank(donor1);
        vm.expectRevert("Campaign does not exist.");
        crowdFund.donateToCampaign{value: DONATION_AMOUNT}(999);
    }

    function testZeroDonation() public {
        uint256 deadline = block.timestamp + 30 days;

        vm.prank(campaignOwner);
        uint256 campaignId =
            crowdFund.createCampaign(campaignOwner, TITLE, DESCRIPTION, TARGET_AMOUNT, deadline, IMAGE_URL);

        vm.prank(donor1);
        vm.expectRevert("Donation must be greater than zero.");
        crowdFund.donateToCampaign{value: 0}(campaignId);
    }

    function testDonationAfterDeadline() public {
        uint256 deadline = block.timestamp + 1 hours;

        vm.prank(campaignOwner);
        uint256 campaignId =
            crowdFund.createCampaign(campaignOwner, TITLE, DESCRIPTION, TARGET_AMOUNT, deadline, IMAGE_URL);

        // Fast forward past deadline
        vm.warp(deadline + 1);

        vm.prank(donor1);
        vm.expectRevert("Campaign has ended.");
        crowdFund.donateToCampaign{value: DONATION_AMOUNT}(campaignId);
    }

    function testDonationAfterTargetReached() public {
        uint256 deadline = block.timestamp + 30 days;

        vm.prank(campaignOwner);
        uint256 campaignId =
            crowdFund.createCampaign(campaignOwner, TITLE, DESCRIPTION, TARGET_AMOUNT, deadline, IMAGE_URL);

        // Donate exactly the target amount
        vm.prank(donor1);
        crowdFund.donateToCampaign{value: TARGET_AMOUNT}(campaignId);

        // Try to donate more after target is reached
        vm.prank(donor2);
        vm.expectRevert("Campaign has already reached its target.");
        crowdFund.donateToCampaign{value: DONATION_AMOUNT}(campaignId);
    }

    function testGetAllCampaigns() public {
        uint256 deadline = block.timestamp + 30 days;

        // Create multiple campaigns
        vm.startPrank(campaignOwner);
        crowdFund.createCampaign(campaignOwner, "Campaign 1", DESCRIPTION, TARGET_AMOUNT, deadline, IMAGE_URL);
        crowdFund.createCampaign(campaignOwner, "Campaign 2", DESCRIPTION, TARGET_AMOUNT * 2, deadline, IMAGE_URL);
        vm.stopPrank();

        CrowdFund.Campaign[] memory allCampaigns = crowdFund.getCampaigns();
        assertEq(allCampaigns.length, 2);
        assertEq(allCampaigns[0].title, "Campaign 1");
        assertEq(allCampaigns[1].title, "Campaign 2");
        assertEq(allCampaigns[1].target, TARGET_AMOUNT * 2);
    }

    function test_RevertWhen_TransferFails() public {
        // Create a contract that rejects ETH to simulate failed transfer
        RejectETH rejectETH = new RejectETH();
        uint256 deadline = block.timestamp + 30 days;

        vm.prank(campaignOwner);
        uint256 campaignId =
            crowdFund.createCampaign(address(rejectETH), TITLE, DESCRIPTION, TARGET_AMOUNT, deadline, IMAGE_URL);

        vm.prank(donor1);
        vm.expectRevert("Transfer failed.");
        crowdFund.donateToCampaign{value: DONATION_AMOUNT}(campaignId);

        // Check that no state was changed
        CrowdFund.Campaign memory campaign = crowdFund.getCampaign(campaignId);
        assertEq(campaign.amountCollected, 0);

        address[] memory donators = crowdFund.getDonators(campaignId);
        assertEq(donators.length, 0);
    }

    function testFallbackAndReceiveFunctions() public {
        uint256 deadline = block.timestamp + 30 days;
        vm.prank(campaignOwner);
        crowdFund.createCampaign(campaignOwner, TITLE, DESCRIPTION, TARGET_AMOUNT, deadline, IMAGE_URL);
        // Low-level call returns (false, data) on revert. Assert false and decode revert message.
        vm.prank(donor1);
        (bool success, bytes memory data) = address(crowdFund).call{value: DONATION_AMOUNT}("");
        assertFalse(success, "fallback/receive should have reverted");
        string memory reason = getRevertMsg(data);
        assertEq(reason, "Campaign does not exist.");
    }
    // Helper to decode revert string from returned data of a failed call
    function getRevertMsg(bytes memory _returnData) internal pure returns (string memory) {
        // If the _res length is less than 68, then the transaction failed silently (without a revert message)
        if (_returnData.length < 68) return "Transaction reverted silently";
        bytes memory revertData = new bytes(_returnData.length - 4);
        for (uint256 i = 4; i < _returnData.length; i++) {
            revertData[i - 4] = _returnData[i];
        }
        return abi.decode(revertData, (string));
    }

}
