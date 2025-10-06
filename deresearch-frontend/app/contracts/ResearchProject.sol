// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


 interface IResearchProjectFactory {
    function updateProjectMilestones(
        address projectAddr,
        string memory _title,
        string memory _description,
        uint256 _deadline,
        uint256 _reward,
        bytes32 _contentHash
    ) external;
}

contract ResearchProject {
    
    struct Milestone {
        string title;
        string description;
        uint256 deadline;
        uint256 reward;
        bool isCompleted;
        address completedBy;
        uint256 timestamp;
        bytes32 contentHash;
    }
    
    string public title;
    address public manager;
    uint256 public totalFunding;
    uint256 public numMilestones;
    bool public isActive;
    bytes32 public projectHash;
    address public projectAddress;
    mapping(uint256 => Milestone) public milestones;
    address public factoryAddress;


    event MilestoneCompleted(uint256 milestoneId, address completedBy, uint256 timestamp);
    event FundsWithdrawn(uint256 milestoneId, address recipient, uint256 amount);
    event MilestoneAdded(uint256 milestoneId, string description, uint256 deadline, uint256 reward, bytes32 contentHash);


    modifier onlyManager() {
        require(msg.sender == manager, "Only project manager can perform this action");
        _;
    }

    modifier milestoneExists(uint256 milestoneId) {
        require(bytes(milestones[milestoneId].description).length != 0, "Milestone does not exist");
        _;
    }

    constructor(string memory _title, address _manager, uint256 _totalFunding, bytes32 _projectHash, address _projectAddress, address _factoryAddress) {
        
        title = _title;
        manager = _manager;
        totalFunding = _totalFunding;
        projectHash = _projectHash;
        projectAddress = _projectAddress;
        isActive = true;
        factoryAddress = _factoryAddress;
    }

    function addMilestone(string memory _title, string memory _description, uint256 _deadline, uint256 _reward, bytes32 _contentHash) public onlyManager {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(_reward > 0, "Reward must be greater than zero");
        milestones[numMilestones] = Milestone({
            title: _title,
            description: _description,
            deadline: _deadline,
            reward: _reward,
            isCompleted: false,
            completedBy: address(0),
            timestamp: 0,
            contentHash: _contentHash
        });
        // require(_reward > 200, "Reward must be ------------greater than 200");
        emit MilestoneAdded(numMilestones, _description, _deadline, _reward, _contentHash);
        // require(_reward > 200, "Reward must be greater than 200");
        // require(factoryAddress != address(0), "Factory address cannot be zero");
        //  // Notify the factory
        // IResearchProjectFactory factory = IResearchProjectFactory(factoryAddress);
        // factory.updateProjectMilestones(projectAddress, _title, _description, _deadline, _reward, _contentHash);
        numMilestones++;
    }

    function getAllMilestones() public view returns (Milestone[] memory) {
        Milestone[] memory allMilestones = new Milestone[](numMilestones);

        for (uint256 i = 0; i < numMilestones; i++) {
            allMilestones[i] = milestones[i];
        }
        
        return allMilestones;
    }

    function completeMilestone(uint256 milestoneId, bytes32 _contentHash) public milestoneExists(milestoneId) {
        Milestone storage milestone = milestones[milestoneId];

        require(block.timestamp <= milestone.deadline, "Milestone deadline has passed");
        require(!milestone.isCompleted, "Milestone already completed");
        require(milestone.contentHash == _contentHash, "Content hash does not match");

        milestone.isCompleted = true;
        milestone.completedBy = msg.sender;
        milestone.timestamp = block.timestamp;

        emit MilestoneCompleted(milestoneId, msg.sender, block.timestamp);

        // Transfer reward to the researcher who completed the milestone
        (bool success, ) = msg.sender.call{value: milestone.reward}("");
        require(success, "Transfer failed");

        emit FundsWithdrawn(milestoneId, msg.sender, milestone.reward);
    }

    // Function to fund the project
    function fundProject() public payable {
        totalFunding += msg.value;
    }

    // Fallback function to receive Ether
    receive() external payable {}
}
