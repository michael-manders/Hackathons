const fs = require("fs");
const addUserDat = require("../../scripts/addUserDat");
const schoolLookup = require("../../scripts/schoolLookup");
module.exports = { execute };

async function execute(data, res) {
    let text = fs.readFileSync("./pages/home/home.html", "utf-8"); // get the html
    res.writeHead(200, "text/html");
    text = addUserDat(text, data.userdat);

    accounts = JSON.parse(
        fs.readFileSync("./assets/data/accounts.json", "utf-8")
    ); // get the accounts

    items = JSON.parse(fs.readFileSync("./assets/data/items.json", "utf-8")); // get the items
    for (item of items) {
        school = accounts.find((x) => x.name == item.holder).school;
        item["locatiion"] = await schoolLookup.execute(school);
    }
    // items = items.filter((x) => x.holmder == data.userdat.user); // filter the items to only show the users items
    items = JSON.stringify(items, null, 4); // stringify the items
    text = text.replace('"[items]"', items); // replace the items in the html with the users items
    usrAccount = accounts.find((x) => x.name == data.userdat.user); // get the users account
    schoolLC = await schoolLookup.execute(usrAccount.school); // get the users school location
    schoolLC = JSON.stringify(schoolLC, null, 4); // stringify the school location
    text = text.replace('"[userlc]"', schoolLC); // replace the school location in the html with the users school location
    res.end(text); // return html
}
