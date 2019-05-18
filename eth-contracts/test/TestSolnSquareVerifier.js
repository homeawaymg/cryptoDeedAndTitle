
var VerifiedMintableComplete = artifacts.require('SolnSquareVerifier');

const proof = require("../../zokrates/code/square/proof_3_9.json");

contract('SolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('Verified Mintable Tests', function () {
        beforeEach(async function () {
            this.contract = await VerifiedMintableComplete.new({from: account_one});
        })

        it('should Test if a new solution can be added for contract - SolnSquareVerifier', async function () {
            let verifyCheck = [];
            let result = await this.contract.mintToken(
                account_two
                , 1
                , proof.proof.A
                , proof.proof.A_p
                , proof.proof.B
                , proof.proof.B_p
                , proof.proof.C
                , proof.proof.C_p
                , proof.proof.H
                , proof.proof.K
                , proof.input
                , {from: account_one});

                result.logs.forEach( (item, index) =>  ( verifyCheck[item.event] = true ) );

                assert.equal(verifyCheck["Verified"],true, "Unable to verify !");
                assert.equal(verifyCheck["Transfer"], true, "Unable to transfer mintend token !" );
                assert.equal(verifyCheck["SolutionAdded"], true, "Unable to add Solution after verificationa nd minting");

                console.log(verifyCheck);
            //console.log();
            //assert.equal(result,7,"Unable to mint tokens!");
        })


        it('should NOT MINT an ERC721 token with bad verification Input - SolnSquareVerifier', async function () {

            let verifyCheck = [];
            let result;

            try {
                result = await this.contract.mintToken(
                    account_two
                    , 1
                    , proof.proof.A
                    , proof.proof.A_p
                    , proof.proof.B
                    , proof.proof.B_p
                    , proof.proof.C
                    , proof.proof.C_p
                    , proof.proof.H
                    , proof.proof.K
                    , [3,9]
                    , {from: account_one});

            } catch (e) {
                result = e.reason;
            }

            assert.equal(result, "The provided proof is not valid!", "Should not be able to mint without proper verfication");
        })

    })
})
