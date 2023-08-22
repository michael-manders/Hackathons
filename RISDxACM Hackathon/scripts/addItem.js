const fs = require("fs");

module.exports = { addItem };

function addItem(name, imgPath, holder, quantity) {
    let json = JSON.parse(fs.readFileSync("./assets/data/items.json", "utf-8"));

    // random id not already in use
    let id = Math.floor(Math.random() * 1000000);
    while (json.find((item) => item.id == id)) {
        id = Math.floor(Math.random() * 1000000);
    }

    let item = {
        name: name,
        imgPath: imgPath,
        holder: holder,
        quantity: quantity,
    };
    json.push(item);
    fs.writeFileSync("./assets/data/items.json", JSON.stringify(json, null, 4));
}
