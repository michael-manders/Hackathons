// const { lookup } = require("dns");
const fs = require("fs");
var nodemailer = require("nodemailer");

const from = "OakOperationsSMU@gmail.com";
const pass = "ynoltuxizahyaoaf";

module.exports = async (workOrder) => {
    let data = JSON.parse(fs.readFileSync("./data/workOrders.json"));
    let type = `${workOrder.type}`;

    const lookup = {
        electric: "Electrical Panel",
        elevator: "Elevator",
        fire: "Fire Alarm",
        plumbing: "Plumbing System",
        HVAC: "HVAC",
    };

    workOrder.type = lookup[type];

    data.push(workOrder);

    fs.writeFileSync("./data/workOrders.json", JSON.stringify(data, null, 4));

    // send the sms notifications
    let contactData = JSON.parse(fs.readFileSync("./data/contacts.json"));

    console.log(contactData, type);

    let phone = contactData[type].phone;
    let email = contactData[type].email;

    let message = `\n\n====================\n\nNew work order on a ${type} from ${workOrder.name}\n (${workOrder.email})\n\n ${workOrder.text}\n\n====================`;

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "OakOperationsSMU@gmail.com",
            pass: "ynoltuxizahyaoaf",
        },
    });

    let mailOptions = {
        from: from,
        to: phone,
        subject: "New Work Order",
        text: message,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return false;
        } else {
            console.log("Email sent: " + info.response);
        }
    });

    return true;
};
