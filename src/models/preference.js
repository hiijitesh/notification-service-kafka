const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = mongoose.Schema;

const preferenceSchema = new Schema(
    {
        userId: String, //Schema.Types.ObjectId,
        channels: {
            type: [String],
            enum: ["push", "email", "sms"],
            default: ["push", "email", "sms"],
        },
        limitPerHour: {
            type: Number,
            default: 3, // per hour
        },
        quietHourStart: {
            type: Number, // in minutes
            default: undefined,
        },
        quietHourEnd: {
            type: Number, // in minutes
            default: undefined,
        },
        // type: {
        //     type: String,
        //     default: "promotion",
        //     enum: ["promotion", "order", "offer"],
        // },
    },
    {
        timestamps: true,
    }
);

preferenceSchema.set("versionKey", false);
preferenceSchema.plugin(aggregatePaginate);

const UserModel = mongoose.model("preference", preferenceSchema);
module.exports = UserModel;
