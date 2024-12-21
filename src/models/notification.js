const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = mongoose.Schema;
const metadataSchema = new Schema({
    screen: String,
    entityId: Schema.Types.ObjectId,
    image: String,
});

const notificationSchema = new Schema(
    {
        userId: Schema.Types.ObjectId,
        heading: String,
        message: String,
        type: {
            type: String,
            default: "promotion",
            enum: ["promotion", "order", "offer"],
        },
        priority: {
            type: String,
            default: "immediate",
            enum: ["immediate", "scheduled", "offer"],
        },
        metadata: {
            metadataSchema,
        },
        isSeen: Boolean,
        seenTime: {
            type: Date,
        },
        isDelivered: Boolean,
        deliveryTime: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

notificationSchema.set("versionKey", false);
notificationSchema.plugin(aggregatePaginate);

const UserModel = mongoose.model(notificationSchema, "notification");
module.exports = UserModel;
