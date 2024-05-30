
const express = require("express");
const router = express.Router(); // yaha humne router ko require kar liya hai 

// const { route } = require("./listing");

const wrapAsync = require("../utils/wrapAsync");

const User = require("../models/user.js");

const passport = require("passport");
// const { saveRedirectUrl } = require("../middleware.js");
// const userController = require("../controllers/users.js");


// for signup *****************************************************
router.get("/signup", (req, res) => {
    // res.send("form");
    res.render("users/signup.ejs");
});


router.post("/signup", 
    wrapAsync (async(req, res) => {
   try{
    let {username, email, password} = req.body;
    const newUser = new User ({email, username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.flash("success", "Registered Successfully!");
    res.redirect("/listings");
    }
   catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
   }
     
})
);


// for login *****************************************************
router.get("/login", (req, res) => {
    // res.send("form");
    res.render("users/login.ejs");
});

router.post("/login", 
    passport.authenticate('local', 
    {failureRedirect : "/login", failureFlash : true}),
    async (req, res) => {
        req.flash("success", "Login Successfully! Welcome back Awesome User, Have a Great Day");
        res.redirect("/listings");
});



// for logout *****************************************************
router.get("/logout", (req, res, next) => {
    // res.send("form");
    req.logout( (err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "Logged Out Successfully");
        res.redirect("/listings");
    })
});







// router.route("/signup").get(userController.renderSignupForm).post( wrapAsync (userController.signup))

// router.route("/login").get(userController.renderLoginForm).post( saveRedirectUrl,passport.authenticate("local", {failureRedirect: "/login", failureFlash :true,}), userController.login 
// )

// router.get("/logout",userController.logout);


module.exports = router;