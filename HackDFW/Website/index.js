const http = require('http');
// const bootstrap = require('bootstrap')
const fs = require('fs');
var formidable = require('formidable');
const hostname = process.env.HOSTNAME || '127.0.0.1'
const { exec } = require('child_process');
const port = process.env.PORT || 5000; // define port 

const server = http.createServer(async (req, res) => {
    res.statusCode = 200;
    url = req.url.split("?")[0]; // devide the data
    data = req.url.split("?")[1];
    folders = [];
    for (folder of url.replace(/\s/g, "").split('/')) {
        if (folder !== "") folders.push(folder);
    };

    console.log(folders);
    /*
    if the first of the page url is /assets then it will try to read the requested
    file, if it is not there it will return 404.
    if the first part is /page, it will run the corrisponding function that returns 
    the page html. 
    if none of these, return 404
    */
    if (folders[0] == "assets") {
        try {
            if (folders[1] == "images") res.writeHead(200, {'Content-Type': 'image/png'})
            res.end(fs.readFileSync(`./assets/${folders[1]}/${folders[2]}`, "utf-8"));
            
        }
        catch {
            res.statusCode = 404;
            res.end()
        }
    }
    else if (folders[0] === 'pages') {

        if (folders[1] == "fileupload") {

            const options = {
                uploadDir : './uploads'
            }
        
            const form = new formidable.IncomingForm(options);
        
            form.parse(req, function (error, fields, file) {
                let filepath = file.upload.filepath;
                let newpath = './uploads/';
                newpath += "uploaded.pdf";
            
                //Copy the uploaded file to a custom folder
                fs.rename(filepath, newpath, function () {});
              });

            res.end('<body onload="window.location.href = \'/\'">')

            exec("C:/Users/12144/AppData/Local/Programs/Python/Python310/python.exe c:/Users/12144/Desktop/Code/CommonCarbon/Backend/functions/main.py", (error, stdout, stderr)=> {
                console.log(error), console.log(stdout), console.log(stderr)
            })
            return

        };

        try {
            fetchPage(folders[1], data, res);
        }
        catch {
            res.statusCode = 404;
            res.end("404 Page Not Found")
        }
    }
   
    else if (folders[0] == undefined) {
        fetchPage("home", data, res);
    }
    else if (folders[0] == "download") {
        res.setHeader('Content-Type', 'application/pdf');
        const src = fs.createReadStream('./return.pdf');
        src.pipe(res)
    }
    else {
        res.statusCode = 404;
    }

    
    

});

server.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})

function fetchPage(name, data, res) {
    fn = require(`./pages/${name}/${name}`);
    fn.execute(data, res);
}

function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

