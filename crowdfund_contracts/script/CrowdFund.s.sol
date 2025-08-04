// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script, console} from "forge-std/Script.sol";
import {CrowdFund} from "../src/CrowdFund.sol";

contract DeployCrowdFund is Script {

    function run() external returns (CrowdFund) {
        vm.startBroadcast();
        CrowdFund crowdFund = new CrowdFund();
        console.log("CrowdFund contract deployed at:", address(crowdFund));
        vm.stopBroadcast();
        return crowdFund;
    }
}
