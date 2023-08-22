const fs = require("fs");

module.exports = { execute };

function execute(data, res) {
    text = fs.readFileSync("./pages/logout/logout.html", "utf-8");
    res.end(text);
}
