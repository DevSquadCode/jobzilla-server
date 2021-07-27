const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const ObjectId = require("mongodb").ObjectID;
require('dotenv').config()
const port = 8080
        
const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());
        
app.get('/', (req, res) => {
    res.send('Hello World!')
})
        
app.listen(port, () => {
    console.log('Example app listening')
}) 
        