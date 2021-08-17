const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
// const ObjectId = require("mongodb").ObjectID();
require('dotenv').config()
const port = process.env.PORT || 8080;
// const port = 8080;

const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());



const { MongoClient, ObjectId } = require('mongodb');
const uri = `mongodb+srv://devSquad:${process.env.DB_PASS}@cluster0.133bl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  
    const testimonialCollection = client.db(`${process.env.DB_NAME}`).collection("testimonials");
    const jobCategoriesCollection = client.db(`${process.env.DB_NAME}`).collection("jobcategories");
    const jobListingCollection = client.db(`${process.env.DB_NAME}`).collection("joblisting");
    const blogsCollection = client.db(`${process.env.DB_NAME}`).collection("blogs");
    const usersCollection = client.db(`${process.env.DB_NAME}`).collection("users");
    const candidatesCollection = client.db(`${process.env.DB_NAME}`).collection("candidates");
  
    app.get('/testimonials', (req, res) => {
        testimonialCollection.find({})
            .toArray((err, documents) => {
                // console.log(documents);
                res.send(documents);
            })
    })


    app.post('/addReview', (req, res) => {

        console.log(req);
        const file = req.files.file;
        const name = req.body.name;
        const post = req.body.post;
        const company = req.body.company;
        const feedback = req.body.feedback;

        const newImg = file.data;
        const encImg = newImg.toString('base64');
        console.log(req.body);
        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };
        console.log({ name, post, company, feedback, image })

        testimonialCollection.insertOne({ name, post, company, feedback, image })
            .then(result => {
                // console.log('inserted count', result);
                res.send(result.insertedCount > 0)
            })
    })

    // add profile

    app.post('/addCandidateProfile', (req, res) => {
        console.log(req.body)
        candidatesCollection.insertOne(req.body)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })


    // add user to database
    app.post('/addUser', (req, res) => {
        usersCollection.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    // get users
    // app.get('/users', (req, res) => {
    //     usersCollection.find({})
    //         .toArray((err, documents) => {
    //             // console.log(documents);
    //             res.send(documents);
    //         })
    // })


    //getting candidateProfiles 
    app.get('/candidateProfile', (req, res) => {
        candidatesCollection.find({})
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


    // bloogs route
    app.get("/getblogs", (req, res) =>{
        blogsCollection.find({})
            .toArray((err, documents) => {
                // console.log(documents);
                res.send(documents);
            })
   })

   app.get("/singleBlog/:id", (req, res) =>{
       console.log(req.params.id)
    blogsCollection.find({_id:ObjectId(req.params.id)})
        .toArray((err, documents) => {

            console.log(err);
            res.send(documents);
        })
})
   
   
   app.post('/createBlogs',async (req, res) => {
       // const title = req.body.title;
       // const description = req.body.description;
       const {title, description, image} = await req.body
       
       console.log(title, description, image);
       
   
       // const file = req.files.file;
       // const name = req.body.name;
       // const post = req.body.post;
       // const company = req.body.company;
       // const feedback = req.body.feedback;
   
       // const newImg = file.data;
       // const encImg = newImg.toString('base64');
       // console.log(req.body);
       // var image = {
       //     contentType: file.mimetype,
       //     size: file.size,
       //     img: Buffer.from(encImg, 'base64')
       // };
       // console.log({ name, post, company, feedback, image })
   
       blogsCollection.insertOne({ title, description, image })
           .then(result => {
               console.log('inserted count', result);
               res.send(result)
           }).catch(err=>console.log(err))
        console.log(title, description, image)
   })
   
   app.delete("/delete/:id", (req, res) => {
    console.log(req.params.id);
    blogsCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        console.log("Deleted Count", result)
        res.send(result);
      })
  });
   
   app.get('/', (req, res) => {
       res.send('Hello World!')
   })
   

    //post a job
    app.post('/addJob', (req, res) => {
        const job = req.body;
        console.log(job);
        jobListingCollection.insertOne(job)
            .then((result) => {
                res.send(result.insertedCount > 0)
            })
    });

    // role
    
  app.post('/userRole', (req, res) => {
    const email = req.body.email;
    usersCollection.find({ email: email })
      .toArray((err, admins) => {
        res.send(admins.length > 0);
      })
  })


});

// });





app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})