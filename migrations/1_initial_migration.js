const { ethers } = require("ethers");

const BanklessKingdom_Governance = artifacts.require("BanklessKingdom_Governance");
const QueenToken = artifacts.require("QueenToken");


module.exports = async function (deployer, network, accounts) {
  // deploy Queen token
  await deployer.deploy(QueenToken);
  const token = await QueenToken.deployed();

  // transfer calldata
  const tokenInstance = await new ethers.Contract(token.address, [require('../build/contracts/QueenToken.json')]);
  const teamAddress = accounts[1];
  const grantAmount = '10000000000000000000000';
  const transferCalldata = tokenInstance.interface.encodeFunctionData('transfer', [teamAddress, grantAmount]);

  // deploy governance token
  await deployer.deploy(BanklessKingdom_Governance, token.address, accounts[2]);
  const governor = await BanklessKingdom_Governance.deployed();

  // create proposal
  await governor.propose(
    [token.address],
    [0],
    [transferCalldata],
    'Proposal #1: Give grant to team',
  );
};
