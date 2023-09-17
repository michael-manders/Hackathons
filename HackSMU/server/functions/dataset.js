const fs = require("fs");

module.exports = () => {
    let data = fs.readFileSync("../data_processing/data.json");
    return JSON.parse(data);
};
