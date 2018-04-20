"use strict";
var express = require("express");
var router = express.Router();
var fs = require("fs");


/* GET home page. */

router.get("/",
    function(req, res) {
        res.render("index", { title: "Code Mailer Bot" });
    });

router.post("/",
    function(req, res) {
        console.log(JSON.stringify(req.body));

        fs.readFile("emails.txt",
            "utf8",
            function(err, data) {
                if (err) throw err;
                var split = data.split(/\r?\n/);
                if (split.includes(req.body.email)) {
                    res.render("duplicate", { 'email': req.body.email});
                } else {
                    fs.readFile("codeslist.txt",
                        "utf8",
                        function(err, data) {
                            if (err) throw err;
                            var split = data.split(/\r?\n/);
                            var code = split.shift();
                            res.render("sent", { 'email': req.body.email, 'code': code });
                            emailCode(req.body.email, code);
                            fs.writeFile("codeslist.txt",
                                split.join("\n"),
                                function(err, data) { if (err) throw err; });
                            fs.appendFile("emails.txt", req.body.email + "\n", function(err) { if (err) throw err; });
                            if (req.body.checkbox === "on")
                                fs.appendFile("subs.txt", req.body.email + "\n", function(err) { if (err) throw err; });
                        });
                }

            });


    });


var nodemailer = require("nodemailer");

var transporter;

fs.readFile("auth.txt",
    "utf8",
    function(err, data) {
        if (err) throw err;
        transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "CodeMailerBot@gmail.com",
                pass: data
            }
        });
    });

function emailCode(emailAddress, code) {
    var mailOptions = {
        from: "CodeMailerBot@gmail.com",
        to: emailAddress,
        subject: "Here's your code",
        text: code
    };

    transporter.sendMail(mailOptions,
        function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });
}

module.exports = router;
