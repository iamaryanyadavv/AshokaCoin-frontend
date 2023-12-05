var AshokaCoin = artifacts.require("./AshokaCoin.sol");
var AshokaCoinSale = artifacts.require("./AshokaCoinSale.sol");

contract("AshokaCoinSale", function (accounts) {
    var tokenSaleInstance;
    var tokenInstance;
    var admin = accounts[0];
    var buyer = accounts[1];
    var tokenPrice = 1000000000000000; //wei
    var tokenAvailable = 750000;
    var numberOfTokens = 10;
    var value = numberOfTokens * tokenPrice;

    it("initializes the contract with the correct values", function () {
        return AshokaCoinSale.deployed()
            .then(function (instance) {
                tokenSaleInstance = instance;
                return tokenSaleInstance.address;
            })
            .then(function (address) {
                assert.notEqual(address, 0x0, "has contract address");
                return tokenSaleInstance.tokenContract();
            })
            .then(function (address) {
                assert.notEqual(address, 0x0, "has token contract address");
                return tokenSaleInstance.tokenPrice();
            })
            .then(function (price) {
                assert.equal(price, tokenPrice, "token price is correct");
            });
    });

    it("facilitates token buying", function () {
        return AshokaCoin.deployed()
            .then(function (instance) {
                //grab token instance first
                tokenInstance = instance;
                return AshokaCoinSale.deployed();
            })
            .then(function (instance) {
                //grab token sale instance
                tokenSaleInstance = instance;
                // provision 75% of tokens
                return tokenInstance.transfer(
                    tokenSaleInstance.address,
                    tokenAvailable,
                    { from: admin }
                );
            })
            .then(function (receipt) {
                return tokenSaleInstance
                    .buyTokens(numberOfTokens, {
                        from: buyer,
                        value: value,
                    })
                    .then(function (receipt) {
                        assert.equal(receipt.logs.length, 1, "triggers one event");
                        assert.equal(
                            receipt.logs[0].event,
                            "Sell",
                            'should be the "Sell" event'
                        );
                        assert.equal(
                            receipt.logs[0].args._buyer,
                            buyer,
                            "logs the account that purchased the tokens"
                        );
                        assert.equal(
                            receipt.logs[0].args._amount,
                            numberOfTokens,
                            "logs the number of tokens purchased"
                        );
                        return tokenSaleInstance.tokensSold();
                    })
                    .then(function (amount) {
                        assert.equal(
                            amount.toNumber(),
                            numberOfTokens,
                            "increment the number of tokens sold"
                        );
                        return tokenInstance.balanceOf(buyer);
                    })
                    .then(function (balance) {
                        assert.equal(balance.toNumber(), numberOfTokens);

                        return tokenInstance.balanceOf(tokenSaleInstance.address);
                    })
                    .then(function (balance) {
                        assert.equal(balance.toNumber(), tokenAvailable - numberOfTokens);
                        return tokenSaleInstance.buyTokens(numberOfTokens, {
                            from: buyer,
                            value: 1,
                        });
                    })
                    .then(assert.fail)
                    .catch(function (error) {
                        assert(
                            error.message,
                            "msg.value must equal number of tokens in wei"
                        );
                        return tokenSaleInstance.buyTokens(800000, {
                            from: buyer,
                            value: value,
                        });
                    })
                    .then(assert.fail)
                    .catch(function (error) {
                        assert(error.message, "cannot purchase more tokens than available");
                    });
            });
    });

    it('ends token sale', function() {
        return AshokaCoin.deployed()
            .then(function (instance) {
                //grab token instance first
                tokenInstance = instance;
                return AshokaCoinSale.deployed();
            })
            .then(function (instance) {
                //grab token sale instance
                tokenSaleInstance = instance;
                // Try to end sale from account other than admin
                return tokenSaleInstance.endSale({from: buyer});
            })
            .then(assert.fail).catch(function(error){
                assert(error.message,'must be admin to end sale');
                // End sale as admin
                return tokenSaleInstance.endSale({from: admin});
            })
            .then(function(receipt){
                // receipt
                return tokenInstance.balanceOf(admin);
            })
            .then(function(balance){
                assert.equal(balance.toNumber(), 999990, 'returns all unsold tokens to admin');
                return tokenInstance.balanceOf(tokenSaleInstance.address)
            })
            .then(function(balance){
                assert.equal(balance.toNumber(), 0, 'reset');
            });
    })
});
