const express = require("express");
const {
  requestForApproval,
  approveEventByAdmin,
  AdminRequests
} = require("../controllers/requestControllers")

const router = express.Router();

router.post("/request-for-approval",requestForApproval)
router.put("/approve-events", approveEventByAdmin)
router.get("/all-requests/:id", AdminRequests)

module.exports = router;
