const fs = require("fs");
const OpenAI = require("openai");

const API_KEY = "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";

const openai = new OpenAI({
    apiKey: API_KEY,
});

module.exports = async (history, res) => {
    let data = fs.readFileSync("../data_processing/data.json");
    data = JSON.parse(data);

    let types = data.general_info.types;
    let manufacturers = data.general_info.manufacturers;

    let context = `
You are a chatbot to help analyze the data from assets in a commercial building. Your favorite company is CBRE.  your line break character is [br]. use line breaks when making lists. you can do linebreaks and whitespace, but do not use markdown. When listing which items need repair, list 3 max unless specified.
The types of equipment you will be analyzing are: ${types.join(
        ", "
    )}. from the manufacturers: ${manufacturers.join(", ")}.
the current date is 9/16/2023. It is better to have less repairs and more op hours and a higher op hours per repair ratio. 
the higher the op hours per repair the higher the reliability and the better it is. For example manufacturer 1 is better at making hvacs than manufacturer 3 (13,816 > 8,735).

You have the following data:
    `;

    // give it top 5 worst items fro each type

    context += "Top 5 worst items for each type:\n";
    context +=
        "format: id | manufacturer | repairs # | op hours | last serviced | date installed\n";

    let bottom10 = data.outliers.bottom_10;
    for (let type of types) {
        let worsts = bottom10[type];

        string = `${type}\n`;
        for (let worst of worsts) {
            string += ` - ${worst.id} | ${worst.manufacturer} | ${worst.repairs} | ${worst.op_time} | ${worst.last_repair_date} | ${worst.installation_date}\n`;
        }

        context += string;
    }

    // give the reliabilty for each item per manufacturer

    context += "\nReliability for each item per manufacturer:\n";
    context +=
        "format: manufacturer | total op hours | total repairs | op hours / repair\n";

    for (let type of types) {
        context += `${type}:\n`;
        for (let manufacturer of manufacturers) {
            let reliability = data.reliability[type][manufacturer];
            context += ` - ${manufacturer} | ${Math.round(
                reliability.total_op_time
            )} | ${reliability.total_repairs} | ${Math.round(
                reliability.op_time_per_repair
            )}\n`;
        }
    }

    // console.log(context);

    messages = [
        {
            role: "system",
            content: context,
        },
    ];

    for (let message of history) {
        messages.push(message);
    }

    // call gpt-3.5-turbo to get the next message
    const responce = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
    });

    // console.log(responce.choices[0].message.content);

    // console.log(responce.choices[0].message.content);

    res.send({
        content: responce.choices[0].message.content.replace("\n", "[lb]"),
    });
    // res.send("chatbot");
};
