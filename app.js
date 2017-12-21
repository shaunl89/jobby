const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const app = express()
const session = require('express-session')
const expressValidator = require('express-validator')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const path = require('path')
const flash = require('connect-flash')
const passport = require('passport')
const port = 3000

const routes = require('./routes/routes')
const dbConfig = require('./config/dbConfig')

// configuration ===============================================================
mongoose.Promise = global.Promise
mongoose.connect(dbConfig.url, { useMongoClient : true })
.then(()=>{ console.log("-- Mongoose ok ---")}, (err) =>{ console.log(err) } )

app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json())// get information from html forms
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public'))) //Set static path to public
app.engine('handlebars', exphbs({ defaultLayout: 'main'}))
// app.set('views', (path.join(__dirname, 'views')))
app.set('view engine', 'handlebars')

app.use(session({ secret: 'iamproudtobeinWDI13', resave: false,
  saveUninitialized: true })); // session secret

//Passport ================
app.use(passport.initialize());
app.use(passport.session());

app.use(flash()); // use connect-flash for flash messages stored in session
app.use((req, res, next) => {
  // before every route, attach the flash messages and current user to res.locals
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

//Express Validation ===================================
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
      let namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}))
// routes ===============================================================
app.use('/', routes)




app.listen(port, ()=>{
    console.log('express-connected');
})
