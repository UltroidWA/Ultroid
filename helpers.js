function successfullMessage(msg) {
    return "β *Ultroid*:  ```" + msg + "```"
}
function errorMessage(msg) {
    return "π *Ultroid*:  ```" + msg + "```"
}
function infoMessage(msg) {
    return "βΊοΈ *Ultroid*:  ```" + msg + "```"
}

 
module.exports = {
    successfullMessage,
    errorMessage,
    infoMessage
}
