// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract CrowdFund {
    struct Campaign {
        address owner;
    }

    function createCampaign() public returns (uint256) {}

    function donateToCampaign() public payable {}

    function getDonators() public view returns (address[] memory) {}

    function getCampaigns() public view returns (Campaign[] memory) {}

    function getCampaign() public view returns (Campaign memory) {}
}
