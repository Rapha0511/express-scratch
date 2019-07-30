const express = require('express'); // import express
const app = express(); // express express apllication 
const port = process.env.PORT || 4000; // port of the server. when we push on heroku he knows where to run it

const ORM = require ('sequelize'); // OBJECT(js) RELATIONAL(SQL) MODEL    js query in sql query


const connectionString = 'postgres://yad3:guest@localhost:5432/yad3'; // connection string to the database
const connection = new ORM(connectionString, {logging: false}); // create a new connection


//models

const Listing = connection.define("listing",{    // creating table  'listing' is the name of the table inside the database

id:{
    type: ORM.INTEGER,
    primaryKey: true,
    autoIncrement: true,
},

title:{
    type : ORM.TEXT,
    allwNull: false,
},

description:{
    type : ORM.TEXT,
    allwNull: false,
},

price:{
    type: ORM.INTEGER,
},

images:{
    type: ORM.ARRAY(ORM.TEXT),
},



},{freezTableName: true})  // the name if fix

app.use(express.json()); // function that parse the request into json (is the content-type is correct)

connection.authenticate()             // test the database connection
    .then(()=>console.log('sucess'))
    .catch((err)=> console.error(err));



app.get('hydrate',(req,res)=>{  
    Listing.sync({force : true }) // sync = efface et creee table
        .then(()=>res.json({message:'success to create table'})) // success if it create table
        .catch(err => console.error(err)||res.status(500).json({message : 'failed to create table '})); // erreur 500 et message si il n'a pas cree les tables
});

app.post('/listing',(req,res)=>{
    Listing.create(req.body) // post a js object 
        .then((response)=>res.json(201).json({created: response.dataValues , message:'created'})) // if the object is correct the obj is create into the database
        .catch(err => console.error(err)||res.status(500).json({message:'create listing failed'}))// else we have a 500 error that say we fucked somewhere


});

app.get('listing',(req,res)=>{
    Listing.findAll() // select every obj in the listing table
        .then(listings => res.json(listings)) //array with the dataValues
        .catch(err => console.error(err)||res.status(500).json({message:'read listings failed'})) //error 
        
})

app.listen(port,()=>console.log(`listening on port`+port));   // we know where the server run and that the server is running