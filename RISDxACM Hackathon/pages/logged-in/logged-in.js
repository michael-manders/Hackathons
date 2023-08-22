const fs = require("fs");

module.exports = { execute };

function execute(data, res) {
    // res.writeHead(200, "text/html");

    email = data.email;
    password = data.psw;

    text = fs.readFileSync("./pages/logged-in/logged-in.html", "utf-8");
    text = text.replace("[email]", email);
    text = text.replace("[password]", password);

    console.log(email);

    res.end(text);
}
