// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Contribution.sol";

contract FundingDrip {
    Contribution public contributionContract;

    uint256 public dripRatePerBlock = 1; // Amount to drip per block
    uint256 public dripPeriod = 365 days; // Drip period (e.g., one year)

    event Drip(address indexed user, uint256 nodeIndex, uint256 amount);

    constructor(address _contributionContract) {
        contributionContract = Contribution(_contributionContract);
    }

    function calculateDrip(address _user, uint256 nodeIndex) public view returns (uint256) {
        Contribution.Node memory node = contributionContract.getNode(nodeIndex);

        if (!node.isFinished && block.timestamp < node.createdAt + dripPeriod) {
            return 0; // Drip is not available yet
        }

        uint256 userNodePoints = contributionContract.getUserNodePoints(_user, nodeIndex);
        uint256 blocksPassed = block.number - contributionContract.getLastDripBlock(_user, nodeIndex);
        uint256 dripAmount = blocksPassed * dripRatePerBlock * userNodePoints;

        if (dripAmount > node.treasury.amount) {
            dripAmount = node.treasury.amount;
        }

        return dripAmount;
    }

    function getBalance(address _user, uint256 nodeIndex) public view returns (uint256) {
        return calculateDrip(_user, nodeIndex);
    }

    function withdraw(uint256 nodeIndex) public {
        uint256 dripAmount = calculateDrip(msg.sender, nodeIndex);
        require(dripAmount > 0, "No balance to withdraw");

        Contribution.Node memory node = contributionContract.getNode(nodeIndex);
        require(node.treasury.amount >= dripAmount, "Insufficient node funds");

        // Update last drip block for the user and reduce funding pool accordingly
        contributionContract.updateLastDripBlock(msg.sender, nodeIndex);
        node.fundingPool -= dripAmount;

        payable(msg.sender).transfer(dripAmount);

        emit Drip(msg.sender, nodeIndex, dripAmount);
    }

    // Fallback function to receive Ether
    receive() external payable {}
}
