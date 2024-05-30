const Joi = require('joi');
//yaha humne listingSchema ko export kar diya hai ab isse app.js me require kar lenge 
module.exports.listingSchema = Joi.object({  // yaha humne listingschema me define kar diya hai ki isme ek object hoga jo required hai 
    listing : Joi.object({   // iske baad humne define kar diya hai ki listing object me given values hogi 
        title: Joi.string().required(),
        description :Joi.string().required(),
        location :Joi.string().required(),
        country :Joi.string().required(),
        price :Joi.number().required(),
        image : Joi.string().allow("" , null),  // image me humne allow kar diya hai ki isko empty chor sakte hai and null value bhi de sakte hai 


    }).required()
}) ;

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment : Joi.string().required(),

    }).required()
})