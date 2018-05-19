var express = require('express');
var app = express();
var path = require('path');
var axios = require('axios')
const cors = require('cors')

app.use(cors())


var questionnaireMap = new Map()
questionnaireMap.set("We are choosing CDs for tonights karaoke. Which are you more into?", {"Rock": 30, "Dance": 4})
questionnaireMap.set("When are you planning to arrive", {"early": 5, "a bit later": 7})
questionnaireMap.set("Do you prefer soda or beer?", {"beer": 13, "soda": 2})
questionnaireMap.set("The sauna and hot tub are heating up. Did you remember to bring your towel?", {"yes": 1, "maybe": 1, "no": 1});
// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.send("ayylmao")
});

app.post('/question', function(req, res) {
    res.send()
    console.log("form post called")
    axios({
        method:'put',
        url:'https://rr0c0nebe8.execute-api.eu-west-1.amazonaws.com/dev/webhook',
        responseType:'json',
        contentType: 'application/json',
        data: { message: req.body.message,
                options: req.body.options
              }
      })
        .then(function(response) {
          console.log(response.data)
          res.send(200)
      });
})

app.post('/results', function(req, res) {
    console.log("request body: " + req)
    var message = req
    console.log("received message: " + message)
    var values = questionnaireMap.get(message)
    if (values == undefined) {
        questionnaireMap.set(message, {})
        values = {}
    }
    var selection = req.body.option
    if (selection in values) {
        values[selection] = values[selection] + 1
    } else {
        values[selection] = 1
    }
    questionnaireMap.set(message, values)
    res.send(200)
})

app.get('/results', function(req, res) {
    console.log(questionnaireMap)
    res.send(JSON.stringify([...questionnaireMap]))
})

app.get('/clearstate', function(req, res) {
    questionnaireMap.clear()
    questionnaireMap.set("We are choosing CDs for tonights karaoke. Which are you more into?", {"Rock": 30, "Dance": 4})
    questionnaireMap.set("When are you planning to arrive", {"early": 5, "a bit later": 7})
    questionnaireMap.set("Do you prefer soda or beer?", {"beer": 13, "soda": 2})
    questionnaireMap.set("The sauna and hot tub are heating up. Did you remember to bring your towel?", {"yes": 1, "maybe": 1, "no": 1});
    res.send(200)
})
var port = process.env.PORT || 8080
app.listen(port);