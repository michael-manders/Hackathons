const http = require("http");
// const bootstrap = require('bootstrap')
const fs = require("fs");
const hostname = process.env.HOSTNAME || "127.0.0.1";
const port = process.env.PORT || 5000; // define port
const addUserDat = require("./scripts/addUserDat.js");
const dotenv = require("dotenv").config();

let userdat = {
    user: "default",
    id: 0,
    password: "12345",
};

const server = http.createServer(async (req, res) => {
    res.statusCode = 200;
    url = req.url.split("?")[0]; // devide the data
    data = req.url.split("?")[1]; // devide the data

    if (data == undefined) {
        data = {};
    } else {
        data = decodeURIComponent(data).replace(/\+/g, " ");
        data = data.split("&");
        data = data.map((x) => x.split("="));
        data = Object.fromEntries(data);
        data["sent"] = true;
    }

    folders = [];
    for (folder of url.replace(/\s/g, "").split("/")) {
        if (folder !== "") folders.push(folder);
    }

    // uri decode all folders
    folders = folders.map((x) => decodeURIComponent(x));

    console.log(folders);

    if (folders[0] == "favicon.ico") {
        data = fs.readFileSync("./assets/favicon.ico");
        res.writeHead(200, {
            "Content-Type": "image/x-icon",
        });
        res.end(data, "binary");
    }
    /*
    if the first of the page url is /assets then it will try to read the requested
    file, if it is not there it will return 404.
    if the first part is /page, it will run the corrisponding function that returns 
    the page html. 
    if none of these, return 404
    */

    cookies = parseCookies(req);

    pallet = "purple";

    if (JSON.stringify(cookies).includes("mjm")) pallet = "green";
    if (JSON.stringify(cookies).includes("jen")) pallet = "default";

    if (folders[0] == "assets") {
        try {
            if (folders[1] == "images") {
                path = folders.slice(1).join("/");
                let dat = fs.readFileSync(`./assets/${path}`);
                res.writeHead(200, {
                    "Content-Type": `image/${folders[2].split(".")[1]}`.replace(
                        "jpg",
                        "text"
                    ),
                });
                // return the requested image
                res.end(dat, "binary");
                return;
            } else {
                let dat = fs.readFileSync(
                    `./assets/${folders[1]}/${folders[2]}`,
                    "utf-8"
                );
                pallets = JSON.parse(
                    fs.readFileSync(`./assets/data/pallets.json`, "utf-8")
                );
                pallet = pallets.find((x) => x.name == pallet);

                [
                    "primary",
                    "secondary",
                    "tertiary",
                    "quadrary",
                    "quinary",
                ].forEach((name, index) => {
                    dat = dat.replace(
                        `--color-${name}: #f5f5f5;`,
                        `--color-${name}: #${pallet.colors[index]};`
                    );
                });

                data["userdat"] = userdat;

                res.end(addUserDat(dat, data.userdat));
                return;
            }
        } catch (err) {
            res.statusCode = 404;
            res.end();
        }
    } else if (folders[0] === "pages") {
        email = cookies["email"];
        password = cookies["password"];

        let json = require("./assets/data/accounts.json");
        let account = json.find((x) => x.email == email);

        // console.log(account);

        if (account != undefined) {
            if (account.password == password) {
                userdat = {
                    user: account.name,
                    id: account.id,
                    password: account.password,
                };
                // console.log(userdat);
            }
        } else {
            if (
                folders[1] == "create-account" ||
                folders[1] == "login" ||
                folders[1] == "logged-in"
            ) {
                fetchPage(folders[1], data, res, req);
                return;
            }

            res.writeHead(302, {
                Location: "../pages/create-account",
            }).end();
            return;
        }

        try {
            fetchPage(folders[1], data, res, req);
        } catch {
            res.statusCode = 404;
            res.end("404 Page Not Found");
        }
    } else if (folders[0] == undefined) {
        res.writeHead(302, { Location: "./pages/home" }).end();
    } else {
        res.statusCode = 404;
    }
});

server.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

function fetchPage(name, data, res, req) {
    data["userdat"] = userdat;
    data["req"] = req;
    try {
        fn = require(`./pages/${name}/${name}`);
        fn.execute(data, res);
    } catch (err) {
        console.log(err);
        res.statusCode = 404;
        res.end("404 Page Not Found");
    }
}

function parseCookies(request) {
    var list = {},
        rc = request.headers.cookie;

    rc &&
        rc.split(";").forEach(function (cookie) {
            var parts = cookie.split("=");
            list[parts.shift().trim()] = decodeURI(parts.join("="));
        });

    return list;
}
