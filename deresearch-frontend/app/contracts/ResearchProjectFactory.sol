// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ResearchProject.sol";

contract ResearchProjectFactory {
    uint256 public projectCount;
    mapping(uint256 => address) public projects;

    // Mapping to store details about each project
    mapping(uint256 => Project) public projectDetails;

    //mapping to get projects by creator
    mapping(address => uint256[]) public projectsByCreator;

    struct Project {
        string title;
        string description;
        uint256 totalFunding;
        address manager;
        bytes32 projectHash;
        address projectAddress;
        uint256 projectId;
        Milestone[] milestones;
    }

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
    
    // Milestone[] memory _milestone;
    event ProjectCreated(address indexed projectContractAddress, uint256 projectId, string title, address manager, bytes32 projectHash);

    function verifyProposal(string memory _title, uint256 _totalFunding, bytes32 _projectHash) internal pure returns (bool) {
        require(_totalFunding > 0, "Insufficient funds for the project");
        return true;
    }

    function createResearchProject(
        string memory _title,
        string memory _description,
        uint256 _totalFunding
    ) external {
        // Automatically generate _projectHash and salt
        bytes32 _projectHash = generateProjectHash(_title, _totalFunding);
        bytes32 salt = generateSalt(_title, _totalFunding);

        require(verifyProposal(_title, _totalFunding, _projectHash), "Proposal verification failed");

        address projectAddress;
        bytes memory bytecode = getBytecode(_title, msg.sender, _totalFunding, _projectHash);

        assembly {
            projectAddress := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }

        require(projectAddress != address(0), "Failed to create project contract");

        

        // Create a new project instance
        Project storage newProject = projectDetails[projectCount];
        
        newProject.title = _title;
        newProject.description = _description;
        newProject.totalFunding = _totalFunding;
        newProject.manager = msg.sender;
        newProject.projectHash = _projectHash;
        newProject.projectAddress = projectAddress;
        newProject.projectId = projectCount;

        emit ProjectCreated(projectAddress, projectCount, _title, msg.sender, _projectHash);
        projects[projectCount] = projectAddress;
        projectsByCreator[msg.sender].push(projectCount);
        projectCount++;
    }

    // Function to generate the project hash based on title and funding
    function generateProjectHash(string memory _title, uint256 _totalFunding) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_title, _totalFunding));
    }

    // Function to generate a unique salt based on title, funding, and other factors
    function generateSalt(string memory _title, uint256 _totalFunding) public view returns (bytes32) {
        return keccak256(abi.encodePacked(block.timestamp, msg.sender, _title, _totalFunding));
    }

    // Function to get the bytecode for the new contract deployment
    function getBytecode(
        string memory _title,
        address _manager,
        uint256 _totalFunding,
        bytes32 _projectHash
    ) private view returns (bytes memory) {
        bytes memory bytecode = type(ResearchProject).creationCode;
        return abi.encodePacked(bytecode, abi.encode(_title, _manager, _totalFunding, _projectHash, address(this)));
    }

    // Function to get the address of the project contract without deploying it
    function getAddress(
        string memory _title,
        address _manager,
        uint256 _totalFunding,
        bytes32 _projectHash,
        bytes32 salt
    ) public view returns (address) {
        bytes memory bytecode = getBytecode(_title, _manager, _totalFunding, _projectHash);
        bytes32 hash = keccak256(abi.encodePacked(bytes1(0xff), address(this), salt, keccak256(bytecode)));
        return address(uint160(uint(hash)));
    }


    // Function to return all project details
    function getAllProjects() external view returns (Project[] memory, Milestone[][] memory) {
        Project[] memory allProjects = new Project[](projectCount);
        Milestone[][] memory allMilestones = new Milestone[][](projectCount);

        for (uint256 i = 0; i < projectCount; i++) {
            allProjects[i] = projectDetails[i];
            allMilestones[i] = projectDetails[i].milestones;
        }

        return (allProjects, allMilestones);
    }

    // Function to return single project details
    function getProjectDetails(uint256 projectId) external view returns (Project memory, Milestone[] memory) {
        require(projectId < projectCount, "Invalid project ID");

        Project storage project = projectDetails[projectId];
        return (project, project.milestones);
    }

 /// commands to get project address and add milestone

    // projectAddress = await ResearchProject.projects(3)
    // ResearchProject = artifacts.require("ResearchProject")
    // project4 = await ResearchProject.at(projectAddress)
    // await project4.addMilestone("First milestone", "smart contract milestone", 1755907200, 100, web3.utils.keccak256("First milestone"))

    // Function to retrieve projects created by a specific account
    function getProjectsByCreator(address creator) external view returns (Project[] memory) {
        uint256[] memory creatorProjectIds = projectsByCreator[creator];
        Project[] memory creatorProjects = new Project[](creatorProjectIds.length);

        for (uint256 i = 0; i < creatorProjectIds.length; i++) {
            creatorProjects[i] = projectDetails[creatorProjectIds[i]];
        }

        return creatorProjects;
    }
    
    function updateProjectMilestones(
        address projectAddr,
        string memory _title,
        string memory _description,
        uint256 _deadline,
        uint256 _reward,
        bytes32 _contentHash
        ) external {
            require(_reward > 220, "Reward must be greater than 220");
            for (uint256 i = 0; i < projectCount; i++) {
                if (projectDetails[i].projectAddress == projectAddr) {
                    projectDetails[i].milestones.push(Milestone({
                        title: _title,
                        description: _description,
                        deadline: _deadline,
                        reward: _reward,
                        isCompleted: false,
                        completedBy: address(0),
                        timestamp: 0,
                        contentHash: _contentHash
                    }));
                    break;
                }
            }
    }

    function getProjectAddress(uint256 projectId) external view returns (address) {
    return projects[projectId];
}

    
}
