const fs = require("fs");

module.exports = {addRequest}

function addRequest( accountName, itemID, date,  ) {
    let json = require("../assets/data/requests.json");
    let request = {
        accountName: accountName,
        itemID: itemID,
        date: date,
        status: undefined
    } 
    json.push(request);
    fs.writeFileSync("../assets/data/requests.json", JSON.stringify(json, null, 4));
}