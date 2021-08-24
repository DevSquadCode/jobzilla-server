const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://devSquad:dev123654@cluster0.133bl.mongodb.net/jobZilla?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const testimonialCollection = client.db(`jobZilla`).collection("testimonials");
const jobCategoriesCollection = client.db(`jobZilla`).collection("jobcategories");
const jobListingCollection = client.db(`jobZilla`).collection("joblisting");
const blogsCollection = client.db(`jobZilla`).collection("blogs");
const usersCollection = client.db(`jobZilla`).collection("users");
const candidatesCollection = client.db(`jobZilla`).collection("candidates");



module.exports = {
    client,
    testimonialCollection,
    jobListingCollection,
    jobCategoriesCollection,
    blogsCollection,
    usersCollection,
    candidatesCollection
}