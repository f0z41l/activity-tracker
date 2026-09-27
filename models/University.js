const mongoose = require("mongoose");

const universitySchema = new mongoose.Schema(
    {
        universityName: {
            type: String,
            required: true,
            trim: true
        },

        programName: {
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

        degree: {
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

        tuitionFee: {
            type: String,
            trim: true
        },

        applicationFee: {
            type: String,
            trim: true
        },

        languageRequirement: {
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

module.exports = mongoose.model("University", universitySchema);