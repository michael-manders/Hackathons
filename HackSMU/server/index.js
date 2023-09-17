const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
const corsOptions = {
    origin: "*", // Set the allowed origin(s)
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Specify the allowed HTTP methods
    credentials: true, // Allow sending cookies and authentication headers
};

app.use(cors(corsOptions));

app.get("/getData", (req, res) => {
    // console.log("getting data");
    let data = require("./functions/dataset")();
    res.send({ data: data });
});

app.get("/chatbot-api", (req, res) => {
    try {
        let data = require("./functions/chatbot/generalChatBot")(
            JSON.parse(decodeURIComponent(req.query.history)),
            res
        );
    } catch (err) {
        console.log(err);
    }
});

app.get("/submitWorkOrder-api", (req, res) => {
    try {
        // console.log("submitting work order");
        let data = require("./functions/submitWorkOrder")(
            JSON.parse(decodeURIComponent(req.query.workorder))
        );
    } catch (err) {
        console.log(err);
    }
    res.send('{"success": true}');
});

app.get("/getWorkOrders-api", (req, res) => {
    let data = require("./functions/getWorkOrder")();
    res.send({ data: data });
});

app.get("*", (req, res) => {
    let path = req.path.split("/").filter((x) => x !== "");
    let params = req.query;

    res.send("hello world");
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
