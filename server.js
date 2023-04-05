const express = require('express');
const app = express();
const request = require('request');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path')
require('dotenv').config()
const cookieParser = require('cookie-parser');

// Define a middleware function to authenticate API requests
const authenticate = (req, res, next) => {
    // Get the Facebook access token from the request
    const accessToken = req.headers['x-access-token'];
    if (!accessToken){
      return res.status(403).json("UN-AUTHORISED ACCESS")
    }

    // Verify the Facebook access token using the Facebook Graph API
    request.get(`https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${process.env.APP_ACCESS_TOKEN}`, (error, response, body) => {
      if (error) {
        return res.status(401).json({ error: 'Unauthorized' });
      }    
      // Call the next middleware function
      next();
    });
  };

//=====================================================
//DB for questions
mongoose.set('strictQuery', false);
//mongoose.connect(process.env.DB_URL)
mongoose.connect('mongodb://localhost/quiz')

const db = mongoose.connection;
db.on('error', (error) => console.error(error))
db.once('open', () => console.error('Connected to Quiz Database'))
//=====================================================

// <------- db ------->

//=====================================================
// -- AUTHENTICATION --
//app.use(authenticate);
app.use(cookieParser())
//=====================================================
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
//=====================================================
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
//=====================================================

// <- QUESTIONS ->
const questionsRouter = require('./routes/questions')
app.use('/questions', questionsRouter)

// <- USERS ->
const usersRouter = require('./routes/users');
// app.use('/users', authenticate, usersRouter)
app.use('/users', usersRouter)

// <- EVENT ->
const eventRouter = require('./routes/event')
app.use('/event', eventRouter)

// <- ADD ->
const addRouter = require('./routes/add')
app.use('/add', addRouter)

// <- LOGIN ->
const loginRouter = require('./routes/login');
app.use('/login', loginRouter)

// <- DEFAULT ->
app.get('/', (req,res)=>{
  res.redirect('/login')
})

// ------------- DELETE THIS -------------
app.get('/temper', (req,res) => {
  res.send(global.blacklist)
})

app.listen(3000, ()=> console.log('Server has started'))
