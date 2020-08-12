var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function() {
    //asks permission to use metamask
    window.ethereum.enable().then((accounts)=>{
        contractInstance = new web3.eth.Contract(abi, "0x2c2D9E87eCFbCb9758df8cf063C71d3C9DBE5304", {from : accounts[0]});
        console.log("contractInstance", contractInstance);
    });


    $("#add_data_button").click(inputData);
    $("#get_data_button").click(fetchAndDisplay);

    function fetchAndDisplay(){
        //query the contract on the blockchain
        contractInstance.methods.getPerson().call().then((result) => {
            console.log("result", result);
            $("#name_output").text(result.name);
            $("#age_output").text(result.age);
            $("#height_output").text(result.height);

        })
    }

    function inputData(){
        var name = $("#name_input").val();
        var age = $("#age_input").val();
        var height = $("#height_input").val();

        var config = {
           value : web3.utils.toWei("1","ether")
        }
        //tell web3 to sign trx with metamask and send to contract
        contractInstance.methods.createPerson(name, age, height)
        .send(config)
        .on("transactionHash", (hash) =>{
            console.log("hash", hash)
        })
        .on("confirmation", (confirmationNr)=>{
            //listener for every confirmation we get for each block on top
            console.log("confirmationNr", confirmationNr)
            if(confirmationNr> 12){//recommended

            }
        })
        .on("receipt", (receipt) =>{
            //info about trx state
            console.log("receipt",receipt)
        })
    }
})
