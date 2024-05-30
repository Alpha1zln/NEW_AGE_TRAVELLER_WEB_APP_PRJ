module.exports.isLoggedIn = (req, res , next) =>{
    
    if(!req.isAuthenticated() ){
        req.flash("error", "First Login before adding a new Abode");
        return res.redirect("/listings");      
    }

    next();
}