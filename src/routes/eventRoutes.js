const express = require("express");
const {createEventController, getAllApprovedEvents, sendMail, getOrganizersEvents}= require("../controllers/eventControllers")
const router = express.Router();

router.post("/create-event", createEventController);
router.get("/get-approved-events", getAllApprovedEvents);
router.get("/get-organizers-events/:id",getOrganizersEvents);
router.post("/send-mail", sendMail);

module.exports = router;