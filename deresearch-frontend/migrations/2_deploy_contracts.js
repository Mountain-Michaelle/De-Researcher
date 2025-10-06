const ResearchProjectFactory = artifacts.require('ResearchProjectFactory');


module.exports = async function(deployer) {
    // Deploy Mock Tether Contract
    await deployer.deploy(ResearchProjectFactory);
    const ResearchProject = await ResearchProjectFactory.deployed();

};