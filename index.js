var express = require('express');
var app = express();
var path = require('path');
var axios = require('axios')
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(cors())

var questionnaireArray = []
questionnaireArray.push({ question: "Do you prefer soda or beer?", 
                          answers: [{name: "Beer", value: 11}, {name: "Soda", value: 42}]
                        })
questionnaireArray.push({ question: "When are you planning to arrive", 
                          answers: [{name: "Early", value: 5}, {name: "A bit late", value: 7}]
                        })
 questionnaireArray.push({ question: "We are choosing CDs for tonights karaoke. Which are you more into?", 
                          answers: [{name: "Rock", value: 30}, {name: "Dance", value: 4}]
                        })
questionnaireArray.push({ question: "The sauna and hot tub are heating up. Did you remember to bring your towel?", 
                        answers: [{name: "Yes", value: 1}, {name: "No", value: 1}, {name: "Maybe", value: 1}]
                      })
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
    console.log("form post called")
    var tempAnswers = []
    console.log(req.body)
    req.body.options.forEach(option => {
        tempAnswers.push({name: option, value: 0})
    })
    questionnaireArray.push({question: req.body.message, answers: tempAnswers})
    console.log("questionnaire array: " + questionnaireArray)
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
    var message = req.body.message
    var option = req.body.option
    console.log("received message: " + message)
    console.log("received option: " + message)
    var resultObject = searchQuestion(message, questionnaireArray)
    var answers = resultObject.answers
    var resultAnswer = searchAnswer(option, answers)
    resultAnswer.value = resultAnswer.value + 1
    answers[resultAnswer] = resultAnswer
    resultObject.answers = answers
    questionnaireArray[resultObject] = resultObject
    /*
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
    */
    res.send(200)
})

app.get('/results', function(req, res) {
    console.log(questionnaireArray)
    res.send(JSON.stringify([...questionnaireArray]))
})


function searchQuestion(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].question === nameKey) {
            return myArray[i];
        }
    }
}
function searchAnswer(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].name === nameKey) {
            return myArray[i];
        }
    }
}
/*
app.get('/clearstate', function(req, res) {
    var questionnaireArray = []
    questionnaireArray.push({ question: "Do you prefer soda or beer?", 
                          answers: [{name: "Beer", value: 11}, {name: "Soda", value: 42}]
                        })
    questionnaireArray.push({ question: "When are you planning to arrive", 
                          answers: [{name: "Early", value: 5}, {name: "A bit late", value: 7}]
                        })
    questionnaireArray.push({ question: "We are choosing CDs for tonights karaoke. Which are you more into?", 
                          answers: [{name: "Rock", value: 30}, {name: "Dance", value: 4}]
                        })
    questionnaireArray.push({ question: "The sauna and hot tub are heating up. Did you remember to bring your towel?", 
                        answers: [{name: "Yes", value: 1}, {name: "No", value: 1}, {name: "Maybe", value: 1}]
                      })

    questionnaireMap.clear()
    questionnaireMap.set("We are choosing CDs for tonights karaoke. Which are you more into?", {"Rock": 30, "Dance": 4})
    questionnaireMap.set("When are you planning to arrive", {"early": 5, "a bit later": 7})
    questionnaireMap.set("Do you prefer soda or beer?", {"beer": 13, "soda": 2})
    questionnaireMap.set("The sauna and hot tub are heating up. Did you remember to bring your towel?", {"yes": 1, "maybe": 1, "no": 1});
    res.send(200)
})
*/
var port = process.env.PORT || 8080
app.listen(port);