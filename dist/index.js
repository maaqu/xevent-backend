'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var express = require('express');
var app = express();
var path = require('path');
var axios = require('axios');

var questionnaireMap = new Map();
questionnaireMap.set("How do you wish to arrive?", { "yes": 1, "maybe": 0, "no": 0 });
// viewed at http://localhost:8080
app.get('/', function (req, res) {
    res.send("ayylmao");
});

app.post('/form_post', function (req, res) {
    console.log("form post called");
    var options = map(req.body);
    axios({
        method: 'put',
        url: 'https://rr0c0nebe8.execute-api.eu-west-1.amazonaws.com/dev/webhook',
        responseType: 'json',
        contentType: 'application/json',
        data: { message: req.body.message,
            options: ["a", "b", "c"]
        }
    }).then(function (response) {
        console.log(response.data);
        res.send(200);
    });
});

app.post('/results', function (req, res) {
    questionnaireMap;
    res.send(200);
});

app.get('/results', function (req, res) {
    var testArray = ["yes", "maybe", "no"];
    var values = questionnaireMap.get("How do you wish to arrive?");
    if (values == undefined) {
        questionnaireMap.set("How do you wish to arrive?", {});
        values = {};
    }
    var testAnswer = testArray[parseInt(Math.random() * 3)];
    console.log("testanswer:" + testAnswer);
    if (testAnswer in values) {
        values[testAnswer] = values[testAnswer] + 1;
    } else {
        console.log(questionnaireMap);
        values[testAnswer] = 1;
    }
    questionnaireMap.set("How do you wish to arrive?", values);
    console.log(questionnaireMap);
    res.send(JSON.stringify([].concat(_toConsumableArray(questionnaireMap))));
});

app.get('/clearstate', function (req, res) {
    questionnaireMap.clear();
    res.send(200);
});

app.listen(8080);