const express = require('express'); // import express
const app = express(); // express express apllication
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 4000; // port of the server. when we push on heroku he knows where to run it

const ORM = require ('sequelize'); // OBJECT(js) RELATIONAL(SQL) MODEL    js query in sql query

const fakeData = require('./fakeData');
const calculateHash = require('./hash');

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
    allowNull: false,
},

description:{
    type : ORM.TEXT,
    allowNull: false,
},

price:{
    type: ORM.INTEGER,
},

images:{
    type: ORM.ARRAY(ORM.TEXT),
},

author:{
    type:ORM.INTEGER,
    allowNull:false,
    references:{
        model:'user',
        key:'id'
    },
}

},{freezTableName: true})  // the name if fix

const User = connection.define("user",{

    id:{
        type: ORM.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    passwordHash: {
        type:ORM.TEXT,
        allowNull:false,
    },

    email:{
        type:ORM.TEXT,
        allowNull:false,
        unique:true,
    },

},{freezeTableName:true})

app.use(express.json()); // function that parse the request into json (is the content-type is correct)

const auth = (req, res, next)=>{  // next is what get u to req res
    const authHeader = req.get('Authorization') || '';  // reading the  value out of the header

    const token = authHeader.split(' ')[1]; //string after the space (ex: Bearer RGDTHDTHDHCCG)

    jwt.verify(token, 'jwt secret code', (err, decoded)=>{  // verify if the token is correct by decoding it with the secret code
      if( err ) return res.status(401).json({ message: 'auth failed' }); // if there is an error it means the token is unvalid we send back a 401
      else {
        req.session = decoded; // save the decoded json with the id
        next(); //next will go to req res
      }
    });
  };

connection.authenticate()             // test the database connection
    .then(()=>console.log('sucess'))
    .catch((err)=> console.error(err));


app.get('/hydrate',(req,res)=>{
 User.sync({force:true})        // sync = efface et creee table  // if this fail it goes to the same catch
    .then(()=>User.bulkCreate(fakeData.users)) //send fake data to the user table
    .then(()=>Listing.sync({force : true }))   // .then for calling the next lines  instead of re writing it  //if this fail it goes to the catch
    .then(()=>Listing.bulkCreate(fakeData.listing)) // send fakedata to the listings table
    .then(()=>res.json({message:'success to create table'})) // success if it create table
    .catch(err => console.error(err)||res.status(500).json({message : 'failed to create table '})); // erreur 500 et message si il n'a pas cree les tables

});

app.post('/listing',auth,(req,res)=>{ // auth is checking if we are connected (auth is a fction)
    Listing.create({...req.body,author : req.session.id}) // post a js object
        .then((response)=>res.status(201).json({created: response.dataValues , message:'created'})) // if the object is correct the obj is create into the database
        .catch(err => console.error(err)||res.status(500).json({message:'create listing failed'}))// else we have a 500 error that say we fucked somewhere


});

app.get('/listing',(req,res)=>{
    Listing.findAll() // select every obj in the listing table
        .then(listings => res.json(listings)) //array with the dataValues
        .catch(err => console.error(err)||res.status(500).json({message:'read listings failed'})) //error

});

app.get('/listing/:id',(req,res)=>{
    Listing.findByPk(1*req.params.id) // select one listing in the listing table by id
        .then(listing => res.json(listing)) //object with the dataValue
        .catch(err => console.error(err)||res.status(500).json({message:'read listing failed'})) //error

});

app.post('/user',(req,res)=>{
    //sign up
    const passwordHash = calculateHash(req.body.password) // send the password and call the fuction and callculate the password

    User.create({ // take the table and create user with email and password
        email:req.body.email,
        passwordHash,
    }).then(()=>res.status(201).json({message: 'sign up succefully'}))
      .catch(()=>res.status(500).json({message:'putain'}))
});

app.post('/login',(req,res)=>{
    const passwordHash = calculateHash(req.body.password) // call the fuction and callculate the password
    User.findOne({where:{email:req.body.email,passwordHash}}) //look for  the user with an email and password
        .then(userResponse=>{
            if (userResponse){ // if we found the user with the mail and password
                jwt.sign( // turn json into an encoded shit no one can fucked
                    { id: userResponse.dataValues.id}, // id of the user we found
                    'jwt secret code', // need a secret code to encode
                    (err,token)=>res.json({token}) // send back  some json with the taken
                );

            }else{
                res.status(401).json({message : 'login failed '}); // 401 with no token if we did not find a user

            }
        });

})

app.listen(port,()=>console.log(`listening on port`+port));   // we know where the server run and that the server is running
