const express = require('express')//access express modules
const app = express() // app is telling us to run express function 
const bodyParser = require('body-parser')// breaks up a string into an object
const MongoClient = require('mongodb').MongoClient

var db, collection; //declaring variables waiting to be assigned 

const url = "mongodb+srv://Meccay:Password@cluster0.qedze.mongodb.net/?retryWrites=true&w=majority";
const dbName = "all-projects";

app.listen(3000, () => {// listening to port waiting for server to be run 
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });//lets us know we have successfully connected to the database 
});
// in the excercise everything is inside mongoclient.connect is there a reason it is not in the savage demo ?
app.set('view engine', 'ejs')// has to come first so HTML will be rendered 
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('flips').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {messages: result})
  })
})

app.post('/flip', (req, res) => {
  db.collection('flips').insertOne({name: req.body.name, prediction: req.body.prediction, wins: req.body.wins}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/showResults', (req, res) => {// update request ater some action
    
  db.collection('flips').findOneAndUpdate({name: req.body.name}, {
    $set: {
      wins: req.body.wins 
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/flip', (req, res) => {
  db.collection('flips').findOneAndDelete({name: req.body.name}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})