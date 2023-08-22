const fs = require("fs");
const addUserDat = require("../../scripts/addUserDat");
module.exports = { execute };

function execute(data, res) {
    let text = fs.readFileSync("./pages/requests/requests.html", "utf-8"); // get the html

    res.writeHead(200, "text/html");
    text = addUserDat(text, data.userdat);
    res.end(text); // return html
}
