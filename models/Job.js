const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: true,
            trim: true
        },

        position: {
            type: String,
            required: true,
            trim: true
        },

        country: {
            type: String,
            required: true,
            trim: true
        },

        city: {
            type: String,
            trim: true
        },

        salary: {
            type: String,
            trim: true
        },

        jobType: {
            type: String,
            trim: true
        },

        openingDate: {
            type: Date
        },

        closingDate: {
            type: Date
        },

        eligibility: {
            type: String,
            trim: true
        },

        status: {
            type: String,
            enum: ["Not Applied", "Applied"],
            default: "Not Applied"
        },

        link: {
            type: String,
            trim: true
        },

        remarks: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Job", jobSchema);