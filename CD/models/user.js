
// 1 may 2k24 - sy - dn
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema ({
    email: {
        type: String, required: true
    }
});

// 2nd may ... 
userSchema.plugin(passportLocalMongoose);  
// it automatically creates username , hashing , salting on its own ... 
// 2nd may - by sy 1 alpha1zln
module.exports = mongoose.model('User', userSchema);