const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    created_at: {
        type: Date,
        default: Date.now,
    },
    email: String,
    password: String,
    followers: {
        type: Number,
        default: 0,
    },
    following: {
        type: Number,
        default: 0,
    },
    postCount: {
        type: Number,
        default: 0,
    },
});

userSchema.set("versionKey", false);

userSchema.plugin(aggregatePaginate);

const UserModel = mongoose.model("User", userSchema, "users");

module.exports = UserModel;
