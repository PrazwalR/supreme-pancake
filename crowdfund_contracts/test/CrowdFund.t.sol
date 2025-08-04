// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Test.sol";
import "../src/CrowdFund.sol";

contract CrowdFundTest is Test {
    CrowdFund public crowdFund;
    address owner = makeAddr("Owner");
    address donor = makeAddr("Donor");
    
    function setUp() public {
        crowdFund = new CrowdFund();
    }

    function testCreateCampaign() public {
        uint256 targetAmount = 100 ether;
        uint256 deadline = block.timestamp + 1 days;
        
        vm.prank(owner);
        uint256 campaignId = crowdFund.createCampaign(
            owner,
            "Test Campaign",
            "Test Description",
            targetAmount,
            deadline
        );

        assertEq(crowdFund.numberOfCampaigns(), 1);
        assertEq(campaignId, 0);
    }

    function testDonateToCampaign() public {
        vm.prank(owner);
        uint256 campaignId = crowdFund.createCampaign(
            owner,
            "Test Campaign",
            "Test Description",
            100 ether,
            block.timestamp + 1 days
        );

        uint256 donationAmount = 1 ether;
        vm.deal(donor, donationAmount);
        vm.prank(donor);
        crowdFund.donateToCampaign{value: donationAmount}(campaignId);

        (address[] memory donators, uint256[] memory donations) = crowdFund.getDonators(campaignId);
        assertEq(donators[0], donor);
        assertEq(donations[0], donationAmount);
    }
}