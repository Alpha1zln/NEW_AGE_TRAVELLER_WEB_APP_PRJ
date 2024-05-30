const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js"); // 30 apr 2024
const {listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");   // model ... User

const listingRouter = require("./routes/listing.js"); 
const reviewRouter = require("./routes/review.js"); 
const session = require('express-session');
const flash = require("connect-flash");
const userRouter = require("./routes/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/NEWAGETRAVELLER";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);      // 14 apr 
app.use(express.static(path.join(__dirname, "/public") ));

const sessionOptions = {
    secret : "mysupersecretcode",
    resave : false,
    saveUninitialized : true,
    cookie : {
      expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge : 7 * 24 * 60 * 60 * 1000,
      httpOnly : true,
    },
};


app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize()); // yaha humne passport ko initialize kar liya hai 
app.use(passport.session()); //iski help se user ko ek session me baar baar login nahi karna padega
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy (User.authenticate())); // iski help se sabhi user ko localstrategy ke through authencticate hoke aana padega
// https://www.npmjs.com/package/passport-local-mongoose
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// demoUser route
// app.get("/demouser", async (req, res)=>{
//   let fakeUser = new User({
//     email:"eklavya@gmail.com",
//     username : "helloworld",
//   }); 

//   let registeredUser = await User.register(fakeUser , "helloworld"); // ab iss information ko db me store karwane ke liye hum User.register ko use karenge jisme hume fakeUser call back ke sath password bhi dena hoga 
//   res.send(registeredUser);
// })




app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});




app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


// app.all("*", (req, res, next) => {
//   next(new expressError(404, "Page Not Found"));
// });









// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

// app.listen(8080, () => {
//   console.log("server is listening to port 8080");
// });



const port = 3000; // Change to any available port - from 8080 to 3000 ... apache server took = 8080 port 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


app.use((err , req , res , next)=>{
  let {statuscode = 500, message = "past steps gone wrong"}= err;
  res.status(statuscode).render("error.ejs", {message});  // yaha humne status code and messaage ke sath error.ejs file ko render karwa diya hai ab jese hii error aayega is file ka code render hoke execute ho jaayega
  // res.status(statuscode).send(message);
})


// passport
// authenticate() Generates a function that is used in Passport's LocalStrategy
// serializeUser() Generates a function that is used by Passport to serialize users into the session
// deserializeUser() Generates a function that is used by Passport to deserialize users into the session
