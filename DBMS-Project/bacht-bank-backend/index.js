const express = require("express");
const cors = require("cors");
const app = express();

const authRoutes = require("./routes/auth");

app.use(cors());
app.use(express.json()); // parse JSON body

app.use("/api", authRoutes); // prefix route

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
