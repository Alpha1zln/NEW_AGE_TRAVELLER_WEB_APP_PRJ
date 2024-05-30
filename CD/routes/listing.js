const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();

const Listing = require("../models/listing.js");

//const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js"); // 30 apr 2024
const {listingSchema, reviewSchema } = require("../schema.js");

const {isLoggedIn}= require("../middleware.js"); 


const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new expressError(400, errMsg);
    }
    else {
      next();
    }
  };


//Index Route
router.get("/", 
    wrapAsync(
    async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);
  
  //New Route
  router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
    //res.render("listings/new.ejs");

  });
  
  //Show Route
  router.get("/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
      req.flash("error", "Abode requested doesnot exist");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  });
  
  //Create Route
  router.post(
    "/", 
    isLoggedIn,
    validateListing, 
    wrapAsync (async (req, res, next) => {
    //try{
      const newListing = new Listing(req.body.listing);
      await newListing.save();
      req.flash("success", "New Abode Added");
      res.redirect("/listings");
    //}
    //catch(err){
    //  next(err);
   // }
  
    })
  );
  
  //Edit Route
  router.get("/:id/edit", isLoggedIn, async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  });
  
  //Update Route ... EDIT part 2 ... 12 apr 2024
  router.put("/:id", isLoggedIn, async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Abode Details Updated");
    res.redirect(`/listings/${id}`);
  });
  
  //Delete Route ... 12 apr 2024
  router.delete("/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Abode Listing Deleted");
    res.redirect("/listings");
  });
  // CRUD work Done //


  module.exports = router;  // yaha humne router object ko export kar diya hai
  