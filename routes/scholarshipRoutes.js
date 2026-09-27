const express = require("express");

const router = express.Router();

const Scholarship = require("../models/Scholarship");


// ========================================
// LIST SCHOLARSHIPS
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
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    provider: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    country: {
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


        const scholarships = await Scholarship
            .find(query)
            .sort(sortOption);


        // Countries

        const countries = await Scholarship.distinct(
            "country"
        );

        countries.sort();


        res.render("scholarships/index", {

            scholarships,

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
// ADD SCHOLARSHIP PAGE
// ========================================

router.get("/add", (req, res) => {

    res.render("scholarships/add");

});


// ========================================
// ADD SCHOLARSHIP
// ========================================

router.post("/add", async (req, res) => {

    try {

        const scholarship =
            new Scholarship(req.body);

        await scholarship.save();

        res.redirect("/scholarships");

    } catch (error) {

        console.error(error);

        res.status(500).send("Server Error");

    }

});


// ========================================
// EDIT SCHOLARSHIP PAGE
// ========================================

router.get("/edit/:id", async (req, res) => {

    try {

        const scholarship =
            await Scholarship.findById(req.params.id);


        if (!scholarship) {

            return res
                .status(404)
                .send("Scholarship not found");

        }


        res.render("scholarships/edit", {

            scholarship

        });

    } catch (error) {

        console.error(error);

        res.status(500).send("Server Error");

    }

});


// ========================================
// UPDATE SCHOLARSHIP
// ========================================

router.post("/edit/:id", async (req, res) => {

    try {

        await Scholarship.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );


        res.redirect("/scholarships");

    } catch (error) {

        console.error(error);

        res.status(500).send("Server Error");

    }

});


// ========================================
// DELETE SCHOLARSHIP
// ========================================

router.post("/delete/:id", async (req, res) => {

    try {

        await Scholarship.findByIdAndDelete(
            req.params.id
        );

        res.redirect("/scholarships");

    } catch (error) {

        console.error(error);

        res.status(500).send("Server Error");

    }

});


module.exports = router;