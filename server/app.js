const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const connectToDb = require("./config/db");
const cors = require("cors");
const emailRoutes = require("./routes/emailRoutes.js");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());

// Use the email routes
app.use("/api", emailRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Server is running");
});

//-------------------------------------deployment code---------//

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  let staticPath = path.join(__dirname1, "/frontend/build");
  console.log("Serving static files from:", staticPath);

  app.use(express.static(staticPath));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Api is running succesfully");
  });
}

//-------------------------------------deployment code---------//

// Connect to MongoDB and start the server
const PORT = process.env.PORT || 8000;

connectToDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
