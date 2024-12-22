const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = mongoose.Schema;

const metadataSchema = new Schema({
    screen: String,
    entityId: String, //Schema.Types.ObjectId
    entityType: String,
    image: String,
});

const notificationSchema = new Schema(
    {
        userId: String, // Schema.Types.ObjectId
        heading: String,
        message: String,
        type: {
            type: String,
            default: "promotion",
            enum: ["promotion", "orders", "offer", "alert"],
        },
        priority: {
            type: String,
            enum: ["low", "high"],
        },
        metadata: {
            type: metadataSchema,
        },
        isSeen: {
            type: Boolean,
            default: false,
        },
        seenTime: {
            type: Date,
        },
        deliveryType: {
            type: String,
            default: "real-time",
            enum: ["real-time", "scheduled"],
        },
        isDelivered: {
            type: Boolean,
            default: false,
        },
        deliveryTime: {
            type: Date,
        },
        send_time: {
            type: Date,
            default: new Date(),
        },
    },
    {
        timestamps: true,
    }
);

notificationSchema.set("versionKey", false);
notificationSchema.plugin(aggregatePaginate);

const UserModel = mongoose.model("notification", notificationSchema);
module.exports = UserModel;
