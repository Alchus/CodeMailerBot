'use strict';
var express = require('express');
var router = express.Router();
var fs = require('fs');


/* GET home page. */
var getData = function () {
    var data = {
        'item1': 'http://public-domain-photos.com/free-stock-photos-1/flowers/cactus-76.jpg',
        'item2': 'http://public-domain-photos.com/free-stock-photos-1/flowers/cactus-77.jpg',
        'item3': 'http://public-domain-photos.com/free-stock-photos-1/flowers/cactus-78.jpg',
        'text' : 'Hello World'
    }
    return data;
}

router.get('/', function (req, res) {
    res.render('index', { title: 'Express', "data": getData() });
});

router.post('/', function (req, res) {
    console.log(JSON.stringify(req.body));

    fs.readFile('codeslist.txt', 'utf8', function (err, data) {
        if (err) throw err;
        var split = data.split(/\r?\n/);
        var code = split.shift();
        res.send({ 'email': req.body.email, 'code': code});
        emailCode(req.body.email, code);
        fs.writeFile('codeslist.txt', split.join('\n'), function (err, data) {if (err) throw err;});
    });

});


var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'CodeMailerBot@gmail.com',
        pass: 'Scalding Tarn'
    }
});

function emailCode(emailAddress, code) {
    var mailOptions = {
        from: 'CodeMailerBot@gmail.com',
        to: emailAddress,
        subject: "Here's your code",
        text: code
    };

    transporter.sendMail(mailOptions,
        function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
}

module.exports = router;
