const fs = require("fs");
const https = require("https");

module.exports = { addAccount };

function addAccount(name, password, email, teacherID, school) {
    let json = JSON.parse(
        fs.readFileSync("./assets/data/accounts.json", "utf-8")
    );

    // if the email already exists
    if (json.find((x) => x.email == email)) {
        return;
    }

    let pfp = "";
    let ipadd =
        "https://ui-avatars.com/api/?background=random&name=" +
        name.replace(" ", "+");
    // save the pfp
    let pfpImgPath = `./assets/images/pfps/${name}.png`.replace("+", " ");
    https.get(ipadd, (res) => {
        // create the empty file
        fs.writeFileSync(pfpImgPath, "");
        const filestream = fs.createWriteStream(pfpImgPath);
        res.pipe(filestream);
    });
    let account = {
        name: name,
        password: password,
        email: email,
        pfpImgPath: pfpImgPath,
        teacherID: teacherID,
        school: school,
    };
    console.log(account);
    json.push(account);
    fs.writeFileSync(
        "./assets/data/accounts.json",
        JSON.stringify(json, null, 4)
    );
}
