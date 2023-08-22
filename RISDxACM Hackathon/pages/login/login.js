const fs = require("fs");
const addUserDat = require("../../scripts/addUserDat");
module.exports = { execute };

function execute(data, res) {
    let text = fs.readFileSync("./pages/login/login.html", "utf-8"); // get the html

    if (data.sent) {
        res.writeHead(301, {
            Location: `../pages/logged-in?email=${data.email}&psw=${data.psw}`,
        }).end();
        return;
    }

    res.writeHead(200, "text/html");
    text = addUserDat(text, data.userdat);
    res.end(text); // return html
}
