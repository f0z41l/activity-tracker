const express = require("express");

const router = express.Router();

const University = require("../models/University");


// ========================================
// LIST UNIVERSITIES
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
                    universityName: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    programName: {
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


        // Deadline

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


        const universities = await University
            .find(query)
            .sort(sortOption);


        const countries = await University.distinct(
            "country"
        );

        countries.sort();


        res.render("universities/index", {

            universities,

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

    res.render("universities/add");

});


// ========================================
// ADD UNIVERSITY
// ========================================

router.post("/add", async (req, res) => {

    try {

        const university =
            new University(req.body);

        await university.save();

        res.redirect("/universities");

    } catch (error) {

        console.error(error);

        res.status(500).send("Server Error");

    }

});

// ========================================
// VIEW UNIVERSITY
// ========================================

router.get("/view/:id", async (req, res) => {

    try {

        const university = await University.findById(
            req.params.id
        );

        if (!university) {
            return res.status(404).send("University not found");
        }

        res.render("universities/view", {
            university,
            title: "University Details"
        });

    } catch (error) {

        console.error(error);

        res.status(500).send("Error loading university");

    }

});

// ========================================
// EDIT PAGE
// ========================================

router.get("/edit/:id", async (req, res) => {

    try {

        const university =
            await University.findById(req.params.id);


        if (!university) {

            return res
                .status(404)
                .send("University not found");

        }


        res.render("universities/edit", {
            university
        });

    } catch (error) {

        console.error(error);

        res.status(500).send("Server Error");

    }

});


// ========================================
// UPDATE
// ========================================

router.post("/edit/:id", async (req, res) => {

    try {

        await University.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.redirect("/universities");

    } catch (error) {

        console.error(error);

        res.status(500).send("Server Error");

    }

});


// ========================================
// DELETE
// ========================================

router.post("/delete/:id", async (req, res) => {

    try {

        await University.findByIdAndDelete(
            req.params.id
        );

        res.redirect("/universities");

    } catch (error) {

        console.error(error);

        res.status(500).send("Server Error");

    }

});


module.exports = router;