const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = mongoose.Schema;

const preferenceSchema = new Schema(
    {
        userId: Schema.Types.ObjectId,
        channels: {
            type: [String],
            enum: ["push", "email", "sms"],
        },
        limitPerHour: {
            type: Number,
            default: 3, // per hour
        },
        quietHourStart: {
            type: Number, // in minutes
        },
        quietHourEnd: {
            type: Number, // in minutes
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

const UserModel = mongoose.model(preferenceSchema, "notification");
module.exports = UserModel;
