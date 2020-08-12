const Peoplecontract = artifacts.require("People")
const truffleAssert = require("truffle-assertions")

contract("People", async function(accounts){
    let instance
    before(async function(){
            instance = await Peoplecontract.deployed();
    })

    it("should not create person with age over 150", async function(){
        await truffleAssert.fails(instance.createPerson("Bob", 200, 190,
        {value : web3.utils.toWei("1", "ether")}), truffleAssert.ErrorType.REVERT)
    })

    it("should not create a person without eth", async function(){
        await truffleAssert.fails(instance.createPerson("Bob", 50, 190,
        {value : 1000}), truffleAssert.ErrorType.REVERT)
    })

    it("should set status correctly", async function(){
        await instance.createPerson("Bob", 65, 190,
        {value : web3.utils.toWei("1", "ether")});
        let result = await instance.getPerson();
        assert(result.senior === true && result.age.toNumber() ===65, "Senior level not set")
    })

    it("non owner shouldnot be able to delete", async function(){
        await instance.createPerson("Bob", 65, 190,
        {from: accounts[2], value : web3.utils.toWei("1", "ether")});

        await truffleAssert.fails(instance.deletePerson(accounts[1],
        {from: accounts[1]}), truffleAssert.ErrorType.REVERT)
    })

    it("owner should be able to delete", async function(){
        await instance.createPerson("Bob", 65, 190,{
            from: accounts[2],
            value : web3.utils.toWei("1", "ether")
        });

        await truffleAssert.passes(await instance.deletePerson(accounts[1],
        {from: accounts[0]}));
    })

    it("balance is increased when person is added", async function(){

        let balance = web3.eth.getBalance(accounts[0])

        await instance.createPerson("Bob", 65, 190,{
            from: accounts[2],
            value : web3.utils.toWei("1", "ether")
        });

        web3.eth.getBalance(accounts[0]) === (balance + web3.utils.toWei("1", "ether"))

        await truffleAssert.passes(await instance.deletePerson(accounts[1],
        {from: accounts[0]}));
    })

    it("owner of contract can withdraw balance", async function(){

        let balance = web3.eth.getBalance(accounts[0])

        await instance.createPerson("Bob", 65, 190,{
            from: accounts[2],
            value : web3.utils.toWei("1", "ether")
        });

        await instance.withdrawAll({from: accounts[0]})


    })
})
