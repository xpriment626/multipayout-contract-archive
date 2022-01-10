const SplitPay = artifacts.require("SplitPay");

contract("SplitPay", (accounts) => {
    let splitPayment = null;
    before(async () => {
        splitPayment = await SplitPay.deployed();
    });
    it("Should split payment", async () => {
        const recipients = [accounts[1], accounts[2], accounts[3]];
        const amounts = [40, 20, 30];
        const initialBalances = await Promise.all(
            recipients.map((recipient) => {
                return web3.eth.getBalance(recipient);
            })
        );
        await splitPayment.send(recipients, amounts, {
            from: accounts[0],
            value: 90,
        });
        const finalBalances = await Promise.all(
            recipients.map((recipient) => {
                return web3.eth.getBalance(recipient);
            })
        );
        recipients.forEach((_item, i) => {
            const finalBalance = web3.utils.toBN(finalBalances[i]);
            const initialBalance = web3.utils.toBN(initialBalances[i]);
            assert(finalBalance.sub(initialBalance).toNumber() === amounts[i]);
        });
    });
    it("Should not split payment if mismatch", async () => {
        const recipients = [accounts[1], accounts[2], accounts[3]];
        const amounts = [40, 20];
        try {
            await splitPayment.send(recipients, amounts, {
                from: accounts[0],
                value: 90,
            });
        } catch (e) {
            assert(
                e.message.includes("unspecified amount or receiving address")
            );
            return;
        }
        assert(false);
    });
    it("Should not split if called by not owner", async () => {
        const recipients = [accounts[1], accounts[2], accounts[3]];
        const amounts = [40, 20, 30];
        try {
            await splitPayment.send(recipients, amounts, {
                from: accounts[5],
                value: 90,
            });
        } catch (e) {
            assert(
                e.message.includes("only the owner can make split payments")
            );
            return;
        }
        assert(false);
    });
});
