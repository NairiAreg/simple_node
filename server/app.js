const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const dbService = require('./dbService')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//! Create

app.post('/insert', (req,res) => {
    // console.log(req.body)
    const {name} = req.body;
    const db = dbService.getDbServiceInstance();

    const result = db.insertNewName(name)

    result
    .then(data => res.json({data}))
    .catch(err => console.log(err))
})

//! Read
app.get('/getAll', (req,res) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllData()
    result
    .then(data => res.json({data}))
    .catch(err => console.log(err))
})

//! Update

app.patch("/update",(req,res) => {
    const {id,name} = req.body
    const db = dbService.getDbServiceInstance();
    
    console.log(id,name,123123)
    const result = db.updateNameById(id,name)

    result
    .then(data => res.json({success: data}))
    .catch(err => console.log(err))
})

//! Delete

app.delete("/delete/:id",(req,res) => {
    // console.log(req.params)
    const {id} = req.params
    const db = dbService.getDbServiceInstance();

    const result = db.deleteRowById(id)

    result
    .then(data => res.json({success: data}))
    .catch(err => console.log(err))
    // res.json({success: true})

})

//! Search

app.get("/search/:name",(req,res) => {
    // console.log(req.params)
    const {name} = req.params
    const db = dbService.getDbServiceInstance();

    const result = db.searchByName(name)

    result
    .then(data => res.json({data}))
    .catch(err => console.log(err))

})



app.listen(process.env.PORT, () => console.log('App is running at port '+process.env.PORT))