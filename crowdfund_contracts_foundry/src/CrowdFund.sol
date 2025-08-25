// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract CrowdFund {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline; // unix timestamp (seconds)
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    uint256 public numberOfCampaigns = 0;
    mapping(uint256 => Campaign) public campaigns;

    // fallback/receive should target the latest campaign (if any)
    fallback() external payable {
        require(numberOfCampaigns > 0, "No campaign to donate to.");
        donateToCampaign(numberOfCampaigns - 1);
    }

    receive() external payable {
        require(numberOfCampaigns > 0, "No campaign to donate to.");
        donateToCampaign(numberOfCampaigns - 1);
    }

    // createCampaign expects _deadline to be a unix timestamp (seconds)
    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        require(_deadline > block.timestamp, "Deadline must be in the future.");
        Campaign storage campaign = campaigns[numberOfCampaigns];

        campaign.owner = msg.sender; // take creator as owner
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;

        numberOfCampaigns++;
        return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable {
        require(_id < numberOfCampaigns, "Campaign does not exist.");
        require(msg.value > 0, "Donation must be greater than zero.");
        require(block.timestamp < campaigns[_id].deadline, "Campaign has ended.");
        require(campaigns[_id].amountCollected < campaigns[_id].target, "Campaign has already reached its target.");

        uint256 amount = msg.value;
        Campaign storage campaign = campaigns[_id];

        // --- Effects first (so reverts roll back state) ---
        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);
        campaign.amountCollected += amount;

        // --- Interaction last ---
        (bool sent, ) = payable(campaign.owner).call{value: amount}("");
        require(sent, "Transfer failed."); // if transfer fails, whole tx reverts and state is rolled back
    }

    function getDonators(uint256 _id) public view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);
        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            allCampaigns[i] = campaigns[i];
        }
        return allCampaigns;
    }

    function getCampaign(uint256 _id) public view returns (Campaign memory) {
        return campaigns[_id];
    }
}
