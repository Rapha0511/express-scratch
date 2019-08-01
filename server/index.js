const express = require('express'); // import express
const app = express(); // express express apllication 
const jwt = require('jsonwebtoken');
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

const auth = (req, res, next)=>{
    const authHeader = req.get('Authorization') || '';  
  
    const token = authHeader.split(' ')[1]; //string from the header
  
    jwt.verify(token, 'jwt secret code', (err, decoded)=>{  // 
      if( err ) return res.status(401).json({ message: 'auth failed' }); // if there is an error  we send back a 401
      else {
        req.session = decoded; // save the decoded json with the id 
        next(); //next will go to 
      }
    });
  };

connection.authenticate()             // test the database connection
    .then(()=>console.log('sucess'))
    .catch((err)=> console.error(err));


app.get('/hydrate',(req,res)=>{ 
 User.sync({force:true})        // sync = efface et creee table  // if this fail it goes to the same catch
    .then(()=>Listing.sync({force : true }))   // .then for calling the next lines  instead of re writing it  //if this fail it goes to the catch
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
        
})

const calculateHash = password => crypto.pbkdf2Sync(req.body.password, 'secret code', 100, 64, 'sha512') // takes a password and  calculate the hash
.toString('hex');

app.post('/user',(req,res)=>{
    //sign up
    const passwordHash = calculateHash(req.body.password) // call the fuction and callculate the password 

    User.create({ // take the table and create user with email and password
        email:req.body.email,
        passwordHash,
    }).then(()=>res.status(201).json({message: 'sign up succefully'}))
      .catch(()=>res.status(500).json({message:'putain'}))  
});

app.post('/login',(req,res)=>{
    const passwordHash = calculateHash(req.body.password) // call the fuction and callculate the password 
    User.findOne({where:{email:req.body.email}}) //look for  the user with an email
        .then(userResponse=>{
            if (userResponse && (userResponse.dataValues.passwordHash === passwordHash)){ // check if the password if correct 
                jwt.sign(
                    { id: userResponse.dataValues.id}, // if correct create a token 
                    'jwt secret code',
                    (err,token)=>res.json({token}) // when its done we get token
                );

            }else{
                res.status(401).json({message : 'login faild '});
            }   
        });

})

app.listen(port,()=>console.log(`listening on port`+port));   // we know where the server run and that the server is running