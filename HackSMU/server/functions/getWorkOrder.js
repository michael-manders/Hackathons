const fs = require("fs");

module.exports = () => {
    let data = JSON.parse(fs.readFileSync("./data/workOrders.json"));
    return data;
};
