const fs = require("fs");

module.exports = {execute};

function execute (data, res) {
    console.log("here")
    let text = fs.readFileSync("./pages/uploadPDF/uploadPDF.html", "utf-8"); // get the html
    res.writeHead(200, 'text/html') 
    res.end(text); // return html
}