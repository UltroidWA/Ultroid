function successfullMessage(msg) {
    return "✅ *Ultroid*:  ```" + msg + "```"
}
function errorMessage(msg) {
    return "🛑 *Ultroid*:  ```" + msg + "```"
}
function infoMessage(msg) {
    return "⏺️ *Ultroid*:  ```" + msg + "```"
}

 
module.exports = {
    successfullMessage,
    errorMessage,
    infoMessage
}
