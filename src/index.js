require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");

const firebase = require('firebase');
const functions = require('./firebase');
const app = express();

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(process.env.PORT || 3001);
app.use(cors(corsOptions))

app.delete('/deleteproduct/:id', (req, res) => {
  console.log(req.params.id);
  let id = req.params.id;
  const dbRef = firebase.database();
  dbRef.ref().child("products").child(id).remove().catch(err => {
    res.send(err);
  })
})

app.post('/addproduct', (req, res) => {
  functions.AddProduct(req.body.image, req.body.name, req.body.price,)
    .catch(function (err) {
      if (err) {
        console.log(err);
      }
    })
})

app.put('/updateproduct', (req, res) => {
  const dbRef = firebase.database();
  dbRef.ref('products/' + req.body.id).set({
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
  })
})

app.get('/getproducts', (req, res) => {
  const dbRef = firebase.database();
  dbRef.ref().child("products").get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        res.send(snapshot.val());

      } else {
        console.log("No data available")
      }
    }).catch(function (error) {
      console.log(error);
    })
})

app.get('/getproduct/:id', (req, res) => {
  let id = req.params.id;
  const dbRef = firebase.database();
  dbRef.ref().child("products").child(id).get()
    .then((snapshot) => {

      if (snapshot.exists()) {
        res.send(snapshot.val());

      } else {
        console.log("No data available")
      }
    }).catch(function (error) {
      console.log(error);
    })
})


app.post('/createuser', (req, res) => {
  functions.SignUpWithEmailAndPassword(req.body.email, req.body.password).then((user => {
    if (!user.err) {
      let userData = JSON.parse(user);
      userData = userData.user;
      res.send(user);
    } else {
      res.send(user.err);
    }
  }))
})


