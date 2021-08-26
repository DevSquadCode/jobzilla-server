// External exports
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const { ObjectId } = require("mongodb");

// internal export
const {
  testimonialCollection,
  candidatesCollection,
  usersCollection,
  jobCategoriesCollection,
  jobListingCollection,
  blogsCollection,
  client,
} = require("./dbCollections/dbCollections");
const router = require("./routes/searchingRoutes");

const port = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());
app.use(router);

client.connect((err) => {
  app.get("/testimonials", (req, res) => {
    testimonialCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/addReview", (req, res) => {
    console.log(req);
    const file = req.files.file;
    const name = req.body.name;
    const post = req.body.post;
    const company = req.body.company;
    const feedback = req.body.feedback;

    const newImg = file.data;
    const encImg = newImg.toString("base64");
    console.log(req.body);
    var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, "base64"),
    };
    console.log({ name, post, company, feedback, image });

    testimonialCollection
      .insertOne({ name, post, company, feedback, image })
      .then((result) => {
        res.send(result.insertedCount > 0);
      });
  });

  // add profile
  app.post("/addCandidateProfile", (req, res) => {
    console.log(req.body);
    candidatesCollection.insertOne(req.body).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  // add user to database
  app.post("/addUser", (req, res) => {
    usersCollection.insertOne(req.body).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  // get user role
  app.get("/getUserRole", (req, res) => {
    const queryEmail = req.query.email;
    usersCollection.find({ email: queryEmail }).toArray((err, user) => {
      res.send(user);
    });
  });

  //getting candidateProfiles
  app.get("/candidateProfile", (req, res) => {
    candidatesCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  //getting job-categories
  app.get("/jobcategories", (req, res) => {
    jobCategoriesCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  //getting job-listing
  app.get("/joblisting", (req, res) => {
    jobListingCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  // bloogs routes
  //get all blogs
  app.get("/getblogs", (req, res) => {
    blogsCollection.find({}).toArray((err, documents) => {
      if (err) {
        res.send(err);
      }
      res.send(documents);
    });
  });

  //get single blog item
  app.get("/singleBlog/:id", (req, res) => {
    console.log(req.params.id);
    blogsCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        if (err) {
          res.send(err);
        }
        res.send(documents);
      });
  });

  // create new blog
  app.post("/createBlogs", async (req, res) => {
    const { title, description, image, email } = await req.body;

    blogsCollection
      .insertOne({ title, description, image, email })
      .then((result) => {
        console.log("inserted count", result);
        res.send(result);
      })
      .catch((err) => console.log(err));
  });

  // Update single blog
  app.put("/update/:id", (req, res) => {
    const { title, description, image, email } = req.body;
    blogsCollection
      .updateOne({ _id: ObjectId(req.params.id) }, { $set: { email: email } })
      .then((result) => {
        res.json({ msg: result });
      });
  });

  //delete single blog
  app.delete("/delete/:id", (req, res) => {
    blogsCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        console.log("Deleted Count", result);
        res.send(result);
      });
  });

  //post a job
  app.post("/addJob", (req, res) => {
    const job = req.body;
    console.log(job);
    jobListingCollection.insertOne(job).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  // role

  app.post("/userRole", (req, res) => {
    const email = req.body.email;
    usersCollection.find({ email: email }).toArray((err, admins) => {
      res.send(admins.length > 0);
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello JobZilla Users!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
