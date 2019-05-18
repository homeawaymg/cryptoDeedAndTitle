var ERC721MintableComplete = artifacts.require('ERC721Mintable');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () {
            this.contract = await ERC721MintableComplete.new({from: account_one});

            // TODO: mint multiple tokens
            var TokensMinted = [];
            await TokensMinted.push(this.contract.mint(account_two,1 ));
            await TokensMinted.push(this.contract.mint(account_two,2 ));
            await TokensMinted.push(this.contract.mint(account_two,3 ));
            await TokensMinted.push(this.contract.mint(account_two,4 ));
            await TokensMinted.push(this.contract.mint(accounts[2],5 ));
            await TokensMinted.push(this.contract.mint(accounts[2],6 ));
            await TokensMinted.push(this.contract.mint(accounts[3],7 ));

            var total = 0;
            TokensMinted.forEach( x => total += x ? 1:0) ;
            assert.equal(total,7,"Unable to mint tokens!");

        })

        it('should return total supply', async function () {
            let count = await this.contract.totalSupply.call({from:account_two});
            assert.equal(count,7,"Total Supply mismatch to what was created!")
        })

        it('should get token balance', async function () {
            let account_two_count = await this.contract.balanceOf.call(account_two);
            let account_2_count = await this.contract.balanceOf.call(accounts[2]);
            let account_3_count = await this.contract.balanceOf.call(accounts[3]);

            assert.equal(account_two_count,4,"Total Supply mismatch to what was created for account two!")
            assert.equal(account_2_count,2,"Total Supply mismatch to what was created for account2!")
            assert.equal(account_3_count,1,"Total Supply mismatch to what was created for account3!")
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {
            let tokenURI = await this.contract.tokenURI.call(2);
            assert.equal(tokenURI,"https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/2", "Token URI does not match expected URI - got=>"+tokenURI);
            tokenURI = await this.contract.tokenURI.call(1);
            assert.equal(tokenURI,"https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", "Token URI does not match expected URI - got=>"+tokenURI);
            let rc = true;
            try {
                tokenURI = await this.contract.tokenURI.call(14);
                rc = false;
            } catch (e) {
            }
            assert.equal(rc,true, "EXPECTED EXCEPTION FOR 14");
        })

        it('should transfer token from one owner to another', async function () {
            let x = await this.contract.transferFrom(account_two, accounts[3], 1, {from: account_two});

            let account_two_count = await this.contract.balanceOf.call(account_two);
            let account_3_count = await this.contract.balanceOf.call(accounts[3]);

            assert.equal(account_two_count,3,"Transfer ERROR - Total Supply mismatch to what was created for account two!")
            assert.equal(account_3_count,2,"Transfer ERROR - Total Supply mismatch to what was created for account3!")
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () {
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () {
            let result = true;
            try {
                await this.contract.mint(account_two,44, {from: accounts[6]} );
                result = false;

            } catch (e) {
            }
            assert.equal(result,true, "Able to mint by not being a contract owner");
        })

        it('should return contract owner', async function () {
            let a = await await this.contract.getOwner();
            assert.equal(accounts[0], a, "Contract owner looks different");
        })

    });
})
