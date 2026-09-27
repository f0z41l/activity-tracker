const express = require("express");
const path = require("path");

const mongoose = require("mongoose");
require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 3000;

// EJS
app.set("view engine", "ejs");

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Form data
app.use(express.urlencoded({ extended: true }));


const internshipRoutes = require("./routes/internshipRoutes");
const scholarshipRoutes = require("./routes/scholarshipRoutes");
const universityRoutes = require("./routes/universityRoutes");
const jobRoutes = require("./routes/jobRoutes");
const taskRoutes = require("./routes/taskRoutes");

const Internship = require("./models/Internship");
const Scholarship = require("./models/Scholarship");
const University = require("./models/University");
const Job = require("./models/Job");
const Task = require("./models/Task");

app.use("/internships", internshipRoutes);
app.use("/scholarships", scholarshipRoutes);
app.use("/universities", universityRoutes);
app.use("/jobs", jobRoutes);
app.use("/tasks", taskRoutes);

// Home page

app.get("/", async (req, res) => {

    try {

        // ========================================
        // BASIC COUNTS
        // ========================================

        const internshipCount = await Internship.countDocuments();

        const scholarshipCount = await Scholarship.countDocuments();

        const universityCount = await University.countDocuments();

        const jobCount = await Job.countDocuments();

        const taskCount = await Task.countDocuments();


        // ========================================
        // APPLICATION COUNTS
        // ========================================

        const internshipApplied = await Internship.countDocuments({
            status: "Applied"
        });

        const internshipNotApplied = await Internship.countDocuments({
            status: "Not Applied"
        });


        const scholarshipApplied = await Scholarship.countDocuments({
            status: "Applied"
        });

        const scholarshipNotApplied = await Scholarship.countDocuments({
            status: "Not Applied"
        });


        const universityApplied = await University.countDocuments({
            status: "Applied"
        });

        const universityNotApplied = await University.countDocuments({
            status: "Not Applied"
        });


        const jobApplied = await Job.countDocuments({
            status: "Applied"
        });

        const jobNotApplied = await Job.countDocuments({
            status: "Not Applied"
        });


        // ========================================
        // TASK COUNTS
        // ========================================

        const pendingTaskCount = await Task.countDocuments({
            status: "Pending"
        });

        const completedTaskCount = await Task.countDocuments({
            status: "Completed"
        });


        // ========================================
        // UPCOMING DEADLINES
        // ========================================

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        // ========================================
// EXPIRED OPPORTUNITIES
// ========================================

const expiredInternships = await Internship.find({
    closingDate: {
        $lt: today
    }
})
.sort({
    closingDate: -1
})
.limit(5);


const expiredScholarships = await Scholarship.find({
    closingDate: {
        $lt: today
    }
})
.sort({
    closingDate: -1
})
.limit(5);


const expiredUniversities = await University.find({
    closingDate: {
        $lt: today
    }
})
.sort({
    closingDate: -1
})
.limit(5);


const expiredJobs = await Job.find({
    closingDate: {
        $lt: today
    }
})
.sort({
    closingDate: -1
})
.limit(5);


        const internships = await Internship.find({
            closingDate: {
                $gte: today
            }
        })
        .sort({
            closingDate: 1
        })
        .limit(5);


        const scholarships = await Scholarship.find({
            closingDate: {
                $gte: today
            }
        })
        .sort({
            closingDate: 1
        })
        .limit(5);


        const universities = await University.find({
            closingDate: {
                $gte: today
            }
        })
        .sort({
            closingDate: 1
        })
        .limit(5);


        const jobs = await Job.find({
            closingDate: {
                $gte: today
            }
        })
        .sort({
            closingDate: 1
        })
        .limit(5);


        const tasks = await Task.find({
            dueDate: {
                $gte: today
            },
            status: "Pending"
        })
        .sort({
            dueDate: 1
        })
        .limit(5);


        // ========================================
        // COMBINE DEADLINES
        // ========================================

        let upcomingDeadlines = [];


        internships.forEach(item => {

            upcomingDeadlines.push({

                title: item.position,

                organization: item.company,

                date: item.closingDate,

                type: "Internship",

                link: `/internships/edit/${item._id}`

            });

        });


        scholarships.forEach(item => {

            upcomingDeadlines.push({

                title: item.name,

                organization: item.provider,

                date: item.closingDate,

                type: "Scholarship",

                link: `/scholarships/edit/${item._id}`

            });

        });


        universities.forEach(item => {

            upcomingDeadlines.push({

                title: item.programName,

                organization: item.universityName,

                date: item.closingDate,

                type: "University",

                link: `/universities/edit/${item._id}`

            });

        });


        jobs.forEach(item => {

            upcomingDeadlines.push({

                title: item.position,

                organization: item.company,

                date: item.closingDate,

                type: "Job",

                link: `/jobs/edit/${item._id}`

            });

        });


        tasks.forEach(item => {

            upcomingDeadlines.push({

                title: item.title,

                organization: item.category || "Task",

                date: item.dueDate,

                type: "Task",

                link: `/tasks/edit/${item._id}`

            });

        });


        // ========================================
        // SORT DEADLINES
        // ========================================

        // ========================================
// CALCULATE DEADLINE STATUS
// ========================================

const now = new Date();

now.setHours(0, 0, 0, 0);


upcomingDeadlines.forEach(item => {

    const deadline = new Date(item.date);

    deadline.setHours(0, 0, 0, 0);


    const difference =
        deadline - now;


    const daysLeft =
        Math.ceil(
            difference / (1000 * 60 * 60 * 24)
        );


    item.daysLeft = daysLeft;


    if (daysLeft < 0) {

        item.deadlineStatus = "Expired";

    } else if (daysLeft === 0) {

        item.deadlineStatus = "Due Today";

    } else if (daysLeft <= 3) {

        item.deadlineStatus = "Due Soon";

    } else if (daysLeft <= 7) {

        item.deadlineStatus = "Upcoming";

    } else {

        item.deadlineStatus = "";

    }

});

        upcomingDeadlines.sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );


        // Keep only the first 8

        upcomingDeadlines = upcomingDeadlines.slice(0, 8);

        // ========================================
// COMBINE EXPIRED OPPORTUNITIES
// ========================================

let expiredOpportunities = [];


expiredInternships.forEach(item => {

    expiredOpportunities.push({

        title: item.position,

        organization: item.company,

        date: item.closingDate,

        type: "Internship",

        link: `/internships/edit/${item._id}`

    });

});


expiredScholarships.forEach(item => {

    expiredOpportunities.push({

        title: item.name,

        organization: item.provider,

        date: item.closingDate,

        type: "Scholarship",

        link: `/scholarships/edit/${item._id}`

    });

});


expiredUniversities.forEach(item => {

    expiredOpportunities.push({

        title: item.programName,

        organization: item.universityName,

        date: item.closingDate,

        type: "University",

        link: `/universities/edit/${item._id}`

    });

});


expiredJobs.forEach(item => {

    expiredOpportunities.push({

        title: item.position,

        organization: item.company,

        date: item.closingDate,

        type: "Job",

        link: `/jobs/edit/${item._id}`

    });

});


expiredOpportunities.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
);


expiredOpportunities = expiredOpportunities.slice(0, 8);
        // ========================================
        // RENDER DASHBOARD
        // ========================================

        res.render("dashboard", {

            // Internship
            internshipCount,
            internshipApplied,
            internshipNotApplied,

            // Scholarship
            scholarshipCount,
            scholarshipApplied,
            scholarshipNotApplied,

            // University
            universityCount,
            universityApplied,
            universityNotApplied,

            // Job
            jobCount,
            jobApplied,
            jobNotApplied,

            // Tasks
            taskCount,
            pendingTaskCount,
            completedTaskCount,

            // Upcoming deadlines
            upcomingDeadlines,
            expiredOpportunities

        });


    } catch (error) {

        console.error(error);

        res.status(500).send("Error loading dashboard");

    }

});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
    });

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
