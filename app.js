const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
require('dotenv').config(); // Load .env variables

const app = express();
const port = 3000;

app.use(express.static("Public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = `https://us19.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_AUDIENCE_ID}`;

    const options = {
        method: "POST",
        auth: `anystring:${process.env.MAILCHIMP_API_KEY}`
    };

    const mailchimpRequest = https.request(url, options, function(response) {
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
    });

    mailchimpRequest.write(jsonData);
    mailchimpRequest.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(port, function() {
    console.log("Server is running on port " + port);
});
