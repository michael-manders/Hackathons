const fs = require("fs");
const addUserDat = require("../../scripts/addUserDat");
const addAccount = require("../../scripts/addAccount");
module.exports = { execute };

function execute(data, res) {
    if (data.sent) {
        // this means sombody has filled out the form
        console.log(addAccount.addAccount);
        addAccount.addAccount(
            data.name,
            data.psw,
            data.email,
            data.teacherID,
            data.school
        );

        res.writeHead(302, {
            Location: `../pages/login?email=${data.email}&psw=${data.psw}`,
        }).end();
        return;
    }

    let text = fs.readFileSync(
        "./pages/create-account/create-account.html",
        "utf-8"
    ); // get the html
    text = addUserDat(text, data.userdat);
    res.writeHead(200, "text/html");
    res.end(text); // return html
}
