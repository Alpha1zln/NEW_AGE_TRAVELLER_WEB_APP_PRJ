
const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router({ mergeParams: true});

const expressError = require("../utils/expressError.js"); // 30 apr 2024
const {reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");




const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new expressError(400, errMsg);
    }
    else {
      next();
    }
  };
  



// 30 apr
// REVIEWS
// POST REVIEW ROUTE
router.post("/", validateReview, 
  wrapAsync(async(req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review); 
  listing.reviews.push(newReview);
  
  await newReview.save();
  await listing.save();

  req.flash("success", "New Review Added");
  //console.log("new review saved");
  //res.send("new review saved");
  res.redirect(`/listings/${listing._id}`); 
  
}) );

// DELETE REVIEW ROUTE
router.delete("/:reviewId",
  wrapAsync(async(req, res) => { 
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`)
  })
);



module.exports = router;  // yaha humne router object ko export kar diya hai
  