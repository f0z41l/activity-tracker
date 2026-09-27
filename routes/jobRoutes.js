const express = require("express");

const router = express.Router();

const Job = require("../models/Job");


// ========================================
// LIST JOBS
// ========================================

router.get("/", async (req, res) => {

    try {

        const search = req.query.search || "";
        const country = req.query.country || "";
        const status = req.query.status || "";
        const deadline = req.query.deadline || "";
        const sort = req.query.sort || "earliest";

        const query = {};


        // Search

        if (search) {

            query.$or = [
                {
                    company: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    position: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    country: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    city: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];

        }


        // Country

        if (country) {
            query.country = country;
        }


        // Status

        if (status) {
            query.status = status;
        }


        // Deadline filter

        if (deadline) {

            const today = new Date();

            today.setHours(0, 0, 0, 0);


            const nextSevenDays = new Date(today);

            nextSevenDays.setDate(
                nextSevenDays.getDate() + 7
            );


            if (deadline === "open") {

                query.closingDate = {
                    $gte: today
                };

            }


            if (deadline === "closingSoon") {

                query.closingDate = {
                    $gte: today,
                    $lte: nextSevenDays
                };

            }


            if (deadline === "expired") {

                query.closingDate = {
                    $lt: today
                };

            }

        }


        // Sorting

        let sortOption = {
            closingDate: 1
        };


        if (sort === "latest") {

            sortOption = {
                closingDate: -1
            };

        }


        const jobs = await Job
            .find(query)
            .sort(sortOption);


        const countries = await Job.distinct("country");

        countries.sort();


        res.render("jobs/index", {

            jobs,

            search,

            country,

            status,

            deadline,

            sort,

            countries

        });

    } catch (error) {

        console.error(error);

        res.status(500).send("Server Error");

    }

});


// ========================================
// ADD PAGE
// ========================================

router.get("/add", (req, res) => {

    res.render("jobs/add");

});


// ========================================
// ADD JOB
// ========================================

router.post("/add", async (req, res) => {

    try {

        const job = new Job(req.body);

        await job.save();

        res.redirect("/jobs");

    } catch (error) {

        console.error(error);

        res.status(500).send("Server Error");

    }

});


// ========================================
// EDIT PAGE
// ========================================

router.get("/edit/:id", async (req, res) => {

    try {

        const job = await Job.findById(req.params.id);


        if (!job) {

            return res
                .status(404)
                .send("Job not found");

        }


        res.render("jobs/edit", {
            job
        });

    } catch (error) {

        console.error(error);

        res.status(500).send("Server Error");

    }

});


// ========================================
// UPDATE JOB
// ========================================

router.post("/edit/:id", async (req, res) => {

    try {

        await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.redirect("/jobs");

    } catch (error) {

        console.error(error);

        res.status(500).send("Server Error");

    }

});


// ========================================
// DELETE JOB
// ========================================

router.post("/delete/:id", async (req, res) => {

    try {

        await Job.findByIdAndDelete(
            req.params.id
        );

        res.redirect("/jobs");

    } catch (error) {

        console.error(error);

        res.status(500).send("Server Error");

    }

});


module.exports = router;