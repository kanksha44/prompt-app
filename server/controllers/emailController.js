const nodemailer = require("nodemailer");
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generatePrompt = async (userMessage) => {
  if (!userMessage || userMessage.trim() === "") {
    throw new Error("User message is required and cannot be empty");
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
      model: "llama3-8b-8192",
    });

    const messageContent =
      chatCompletion.choices[0]?.message?.content ||
      chatCompletion.choices[0]?.message?.text;

    if (messageContent) {
      return messageContent;
    } else {
      console.error("Invalid response format:", chatCompletion);
      return "No response";
    }
  } catch (error) {
    console.error("Error generating prompt:", error);
    throw new Error("Failed to generate prompt");
  }
};

// Function to send email using SMTP
const sendEmail = async (email, message) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: "Your Generated Prompt",
    text: message,
  };

  return transporter.sendMail(mailOptions);
};

// generate a message based on prompt
const generateMessage = async (req, res) => {
  const { prompt } = req.body;
  // console.log("Received prompt:", prompt);

  try {
    const generatedMessage = await generatePrompt(prompt);
    res.json({ message: generatedMessage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// send the generated message via email
const sendEmailHandler = async (req, res) => {
  const { email, prompt } = req.body;
  try {
    const generatedMessage = await generatePrompt(prompt);
    await sendEmail(email, generatedMessage);
    res.json({ success: true, message: "Email sent!" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message,
    });
  }
};
module.exports = { generateMessage, sendEmailHandler };
