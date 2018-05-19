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
// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.send("ayylmao")
});

app.post('/question', function(req, res) {
    console.log("form post called")
    var tempAnswers = []
    console.log("req", req)
    console.log("req.body:", req.body)
    req.body.options.forEach(option => {
        tempAnswers.push({name: option, value: 0})
    })
    questionnaireArray.push({question: req.body.message, answers: tempAnswers})
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
    var {message, option} = req.body
    var tempArray = questionnaireArray.map(questionnaire => {
        if (questionnaire.question === message) {
            questionnaire.answers = questionnaire.answers.map(answer => {
                if (answer.name === option) {
                    answer.value = answer.value + 1
                }
                return answer
            })
        }
        return questionnaire
    })
    console.log(JSON.stringify(tempArray))
    questionnaireArray = tempArray
    res.send(200)
})

app.get('/results', function(req, res) {
    console.log(questionnaireArray)
    res.send(JSON.stringify([...questionnaireArray]))
})

/*
function caVotingAssistant() {
    var question = questionnaireArray[questionnaireArray.length-1]
    var randomIndex = parseInt(Math.random()*(question.answers.length-1))
    console.log(randomIndex)
    console.log(question.answers[randomIndex])
    question.answers[randomIndex].value = question.answers[randomIndex].value + 1
}

var doStuff = function() {
    caVotingAssistant()
    setTimeout(doStuff, 1500)
}
doStuff()
*/

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
    res.send(200)
})
var port = process.env.PORT || 8080
app.listen(port);