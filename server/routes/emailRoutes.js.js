const express = require("express");
const {
  generateMessage,
  sendEmailHandler,
} = require("../controllers/emailController");

const router = express.Router();

router.post("/generate", generateMessage);
router.post("/send-email", sendEmailHandler);

module.exports = router;
