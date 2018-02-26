var express              = require("express"),
    mongoose             = require("mongoose"),
    passport             = require("passport"),
    bodyParser           = require("body-parser"),
    User                 =require("./models/users.js"),
    LocalStrategy        = require("passport-local"),
    passportLocalMongoose= require("passport-local-mongoose"),
    flash                = require('connect-flash'),
    jq                   = require('jquery');

var app = express();

app.use(require("express-session")({
    secret: "yay",
    resave: false,
    saveUnintialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(bodyParser.urlencoded({extended:true}));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect("mongodb://localhost/emmathomas");

app.use(express.static("public"));
app.use(express.static("models"));


app.set("view engine", "ejs");
//==================================
//ROUTES
//==================================
app.get("/", function (req,res){
    res.render("home");
});
app.get("/home", function (req,res){
    res.render("home");
});

app.get("/about", function (req,res){
    res.render("about");
});
app.get("/services", function (req,res){
    res.render("services");
});

app.get("/sh", isLoggedIn, function (req,res) {
    res.render("sh");
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};
app.get("/contact", function (req,res){
    res.render("contact");
});
//REGISTRATION
//====================================
app.get("/register", function (req,res){
    res.render("register", {message: ""});
});
app.post("/register", function (req,res) {
    req.body.username;
    req.body.password;
    User.register(new User({username: req.body.username}), req.body.password, function (err, user) {
        if (err) {
            return res.render('register', {message:"NO"});
        }
        passport.authenticate('local')(req, res, function () {
            res.render('sh');
        })
    })
});

//====================================
// LOGIN
//====================================
app.get("/login", function (req,res){
    res.render("login");
});
//middleware
app.post("/login", passport.authenticate ('local', {
    successRedirect:"/sh",
    failureRedirect:"/login"
}), function (req,res){
});

//====================================
// LOGOUT
//====================================
app.get("/logout",function(req,res) {

    req.logout();
    res.redirect("/");
});
//====================================
app.get("/*", function (req,res){
    res.send("file not found");
});
app.listen(3000, function() {
    console.log("server is on!")
});