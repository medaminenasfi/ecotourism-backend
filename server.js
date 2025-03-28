require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./Config/dbconn");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const corsOptions = require("./Config/corsOptions");
const PORT = process.env.PORT || 5000;
const circuitRoutes = require("./routes/circuitRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const serviceRoutes = require("./routes/serviceRoutes.js");
const avisRoutes = require("./routes/avisRoutes");
const reclamationRoutes = require("./routes/reclamationRoutes");
connectDB();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root.js"));
app.use("/auth", require("./routes/authRoutes.js"));
app.use("/users", require("./routes/userRoutes.js"));

app.use("/api/circuits", circuitRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/avis", avisRoutes);
app.use("/api/reclamations", reclamationRoutes);


app.all("*", (req,res)=>{
    res.status(404)
    if(req.accepts("html")){
      res.sendFile(path.join(__dirname, "views","404.html"))

    }else if (req.accepts(("json"))){
  res.json({message:"404 Not Found"});
    }else {
      res.type("txt").send("404 Not Found")
    }
})

mongoose.connection.once("open", () => {
  console.log("connected to mongoDB");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
