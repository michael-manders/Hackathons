const fs = require("fs");
const formidable = require("formidable");
const addUserDat = require("../../scripts/addUserDat");
const addItem = require("../../scripts/addItem");
module.exports = { execute };

function execute(data, res) {
    req = data.req;
    if (req.method == "POST") {
        // if the request is a post request
        var form = new formidable.IncomingForm(); // create a new form
        form.parse(req, function (err, fields, files) {
            // parse the form
            image = files.image; // get the image

            if (image == undefined) {
                let text = fs.readFileSync(
                    "./pages/list-extra/list-extra.html",
                    "utf-8"
                ); // get the html
                text = addUserDat(text, data.userdat);
                res.writeHead(200, "text/html");
                res.end(text); // return html
            }

            console.log(image.originalFilename);

            path = `./assets/images/items/${fields.item}.${
                image.mimetype.split("/")[1]
            }`; // set the path

            // create a write stream to save the file
            const writeStream = fs.createWriteStream(path);

            // pipe the file to the write stream
            fs.createReadStream(image.filepath).pipe(writeStream);
            addItem.addItem(
                fields.item,
                path,
                data.userdat.user,
                fields.amount
            ); // add the item to the json file
        });
    }

    let text = fs.readFileSync("./pages/list-extra/list-extra.html", "utf-8"); // get the html
    text = addUserDat(text, data.userdat);

    items = JSON.parse(fs.readFileSync("./assets/data/items.json", "utf-8")); // get the items
    items = items.filter((x) => x.holder == data.userdat.user); // filter the items to only show the users items
    items = JSON.stringify(items, null, 4); // stringify the items
    text = text.replace('"[items]"', items); // replace the items in the html with the users items

    res.writeHead(200, "text/html");
    res.end(text); // return html
}
