const express = require('express');
const { jobListingCollection } = require('../dbCollections/dbCollections');
const router = express.Router();




router.post('/searching', (req, res) => {
    const jobTitle = req.body.jobPosition;
    const jobType = req.body.jobType;
    const jobLocation = req.body.jobLocation;

    if(jobTitle || jobType || jobLocation){
        let query = {};    
        if(jobTitle){
               query = {...query, title : jobTitle}
            }
        if(jobType){
            query = {...query, type : jobType}
        }
        if(jobLocation){
            query = {...query, location : jobLocation}   
        }
        jobListingCollection.find(query)
        .collation({locale: 'en', strength: 1})
        .toArray((err, documents) => {
            res.send(documents);
        });
    }else{
        res.status(401).json({
            message: 'Please type something before search !'
        });
    }    
});

module.exports = router;