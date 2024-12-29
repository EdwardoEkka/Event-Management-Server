const express = require("express");
const {
  SignUpController,
  SignInController,
  AuthenticateUser,
  ApproveUserRole,
  GetAllUsers,
  GetAllAdmins,
} = require("../controllers/userControllers");
const verifyToken = require("../middlewares");

const router = express.Router();

router.post("/sign-up", SignUpController);
router.post("/sign-in", SignInController);
router.get("/authenticate-user", verifyToken, AuthenticateUser);
router.get("/get-all-users", GetAllUsers);
router.put("/set-user-role", ApproveUserRole);
router.get("/get-all-admins", GetAllAdmins);


module.exports = router;
