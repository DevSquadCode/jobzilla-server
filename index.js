const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
// const fileUpload = require('express-fileupload');
const ObjectId = require("mongodb").ObjectID;
require('dotenv').config()
// const port = process.env.PORT || 8080;
const port = 8080;
        
const app = express()
app.use(cors());
app.use(bodyParser.json());
// app.use(fileUpload());



const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://devSquad:${process.env.DB_PASS}@cluster0.133bl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const testimonialCollection = client.db(`${process.env.DB_NAME}`).collection("testimonials");
    // perform actions on the collection object3
    const jobCategoriesCollection = client.db(`${process.env.DB_NAME}`).collection("jobcategories");
    const jobListingCollection = client.db(`${process.env.DB_NAME}`).collection("joblisting");

    app.get('/testimonials', (req, res) => {
        testimonialCollection.find({})
            .toArray((err, documents) => {
                // console.log(documents);
                res.send(documents);
            })
    });

    //getting job-categories
    app.get('/jobcategories', (req, res) => {
        jobCategoriesCollection.find({})
            .toArray((err, documents) => {
                // console.log(documents);
                res.send(documents);
            })
    });

    //getting job-listing
    app.get('/joblisting', (req, res) => {
        jobListingCollection.find({})
            .toArray((err, documents) => {
                // console.log(documents);
                res.send(documents);
            })
    });


});



app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})