const express = require("express");

const router = express.Router();

const Task = require("../models/Task");


// ========================================
// TASK LIST
// ========================================

router.get("/", async (req, res) => {

    try {

        const search = req.query.search || "";
        const status = req.query.status || "";
        const priority = req.query.priority || "";
        const sort = req.query.sort || "";

        const query = {};

        // Search
        if (search) {

            query.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    category: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    remarks: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];

        }


        // Status filter
        if (status) {
            query.status = status;
        }


        // Priority filter
        if (priority) {
            query.priority = priority;
        }


        // Sorting
        let sortOption = {
            dueDate: 1
        };

        if (sort === "latest") {
            sortOption = {
                dueDate: -1
            };
        }

        if (sort === "createdLatest") {
            sortOption = {
                createdAt: -1
            };
        }

        if (sort === "createdOldest") {
            sortOption = {
                createdAt: 1
            };
        }


        const tasks = await Task
            .find(query)
            .sort(sortOption);


        res.render("tasks/index", {
            tasks,
            search,
            status,
            priority,
            sort
        });

    } catch (error) {

        console.error(error);

        res.status(500).send("Error loading tasks");

    }

});


// ========================================
// ADD TASK PAGE
// ========================================

router.get("/add", (req, res) => {

    res.render("tasks/add");

});


// ========================================
// ADD TASK
// ========================================

router.post("/add", async (req, res) => {

    try {

        const {
            title,
            dueDate,
            priority,
            category,
            status,
            remarks
        } = req.body;


        await Task.create({

            title,
            dueDate: dueDate || null,
            priority,
            category,
            status,
            remarks

        });


        res.redirect("/tasks");

    } catch (error) {

        console.error(error);

        res.status(500).send("Error adding task");

    }

});


// ========================================
// EDIT TASK PAGE
// ========================================

router.get("/edit/:id", async (req, res) => {

    try {

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).send("Task not found");
        }


        res.render("tasks/edit", {
            task
        });

    } catch (error) {

        console.error(error);

        res.status(500).send("Error loading task");

    }

});


// ========================================
// UPDATE TASK
// ========================================

router.post("/edit/:id", async (req, res) => {

    try {

        const {
            title,
            dueDate,
            priority,
            category,
            status,
            remarks
        } = req.body;


        await Task.findByIdAndUpdate(
            req.params.id,
            {
                title,
                dueDate: dueDate || null,
                priority,
                category,
                status,
                remarks
            }
        );


        res.redirect("/tasks");

    } catch (error) {

        console.error(error);

        res.status(500).send("Error updating task");

    }

});


// ========================================
// DELETE TASK
// ========================================

router.post("/delete/:id", async (req, res) => {

    try {

        await Task.findByIdAndDelete(req.params.id);

        res.redirect("/tasks");

    } catch (error) {

        console.error(error);

        res.status(500).send("Error deleting task");

    }

});


module.exports = router;