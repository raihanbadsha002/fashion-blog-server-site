const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 8022;



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v8nsc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("fashionBlog").collection("blogInfo"); 
  const AdminCollection = client.db("fashionBlog").collection("admin"); 

  app.post('/addBlogs', (req,res) => {
    const newBlog = req.body;
    collection.insertOne(newBlog)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })
  app.get('/blogs', (req, res) => {
    collection.find()
    .toArray((err, items) => {
      res.send(items);
    })
  })
  app.get('/blogs/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    collection.find({_id: id})
    .toArray((err, documents) => {
       res.send(documents[0])
    })
  })
  app.delete('/deleteBlog/:id', (req,res) =>{
    const id = ObjectID(req.params.id);
    collection.findOneAndDelete({_id: id})
    .then(result => {
      res.send(result.deletedCount > 0);
    })
 })
 app.post('/addAdmin', (req, res) => {
  const order = req.body;
  AdminCollection.insertOne(order)
      .then(result => {
          res.send(result.insertedCount > 0);
      })
})
app.post('/isAdmin', (req, res) => {
  const email = req.body.email;
  AdminCollection.find({ email: email })
    .toArray((err, admins) => {
      res.send(admins.length > 0);
    })
})



});




app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
