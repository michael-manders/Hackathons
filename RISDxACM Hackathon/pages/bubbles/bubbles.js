const fs = require("fs");
const addUserDat = require("../../scripts/addUserDat");

module.exports = { execute };

function execute(data, res) {
    res.writeHead(200, "text/html");
    text = fs.readFileSync("./pages/bubbles/bubbles.html", "utf-8");
    text = addUserDat(text, data.userdat);
    res.end(text);
}
