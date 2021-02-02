const axios = require("axios");
const auth = require('../config/auth.json')


module.exports.getStudentData = async function () {
    return(
        axios.all([
            axios.get(`https://api.trello.com/1/boards/${auth.boardId}/lists?key=${auth.api_key}&token=${auth.token}`),
            axios.get(`https://api.trello.com/1/boards/${auth.boardId}/cards?key=${auth.api_key}&token=${auth.token}`),
            axios.get(`https://api.trello.com/1/boards/${auth.boardId}/?key=${auth.api_key}&token=${auth.token}`)

          ]).then(await axios.spread((lists, cards, board) => {
            return({
                success : true,
                code : 200,
                message : "Successfully Fetched Board data",
                data : {
                    board : board.data,
                    lists: lists.data,
                    cards : cards.data
                }
            })
        })).catch((error)=>{
        return({
            success : false,
            message : "Failed",
            error : error
        })
    }))
}

module.exports.addNewTask = async function (reqBody){
    var data = {
        name : reqBody.cardName,
        idList : reqBody.listId,
    }
    return(await axios.post(`https://api.trello.com/1/cards?key=${auth.api_key}&token=${auth.token}`,data).then((res) =>{
        return(res);
    }))
}