const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        email: String,
        password: String,
        name: String,
        deviceId: String,
    },
    {
        timestamps: true,
    }
);

userSchema.set("versionKey", false);
userSchema.plugin(aggregatePaginate);

const UserModel = mongoose.model("User", userSchema, "users");
module.exports = UserModel;
