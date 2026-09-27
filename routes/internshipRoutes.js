const express = require("express");
const router = express.Router();

const Internship = require("../models/Internship");

// Show all internships

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
                { company: { $regex: search, $options: "i" } },
                { position: { $regex: search, $options: "i" } },
                { country: { $regex: search, $options: "i" } }
            ];
        }

        // Country
        if (country) {
            query.country = country;
        }

        // Application status
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
        let sortOption = { closingDate: 1 };

        if (sort === "latest") {
            sortOption = { closingDate: -1 };
        }


        const internships = await Internship
            .find(query)
            .sort(sortOption);


        // Countries
        const countries = await Internship.distinct("country");

        countries.sort();


        res.render("internships/index", {
            internships,
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
// Show add internship form
router.get("/add", (req, res) => {
    res.render("internships/add");
});

// Add internship
router.post("/add", async (req, res) => {
    try {
        const internship = new Internship(req.body);

        await internship.save();

        res.redirect("/internships");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});
// ========================================
// VIEW INTERNSHIP
// ========================================

router.get("/view/:id", async (req, res) => {

    try {

        const internship = await Internship.findById(
            req.params.id
        );

        if (!internship) {
            return res.status(404).send("Internship not found");
        }

        res.render("internships/view", {
    internship,
    title: "Internship Details"
});

    } catch (error) {

        console.error(error);

        res.status(500).send("Error loading internship");

    }

});


// Show edit internship form
router.get("/edit/:id", async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);

        if (!internship) {
            return res.status(404).send("Internship not found");
        }

        res.render("internships/edit", {
            internship
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});


// Update internship
router.post("/edit/:id", async (req, res) => {
    try {
        await Internship.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.redirect("/internships");

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});


// Delete internship
router.post("/delete/:id", async (req, res) => {
    try {
        await Internship.findByIdAndDelete(req.params.id);

        res.redirect("/internships");

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

module.exports = router;