const SplitPay = artifacts.require("SplitPay");

module.exports = function (deployer, _network, accounts) {
    deployer.deploy(SplitPay, accounts[0]);
};
