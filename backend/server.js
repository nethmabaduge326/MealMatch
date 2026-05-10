const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// create the app
const app = express();

//app middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

//route imports
const userRoute = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const kitchenRoutes = require("./routes/kitchenRoutes");
const billInfoRoutes = require("./routes/billInfoRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");

//routes
app.use("/user", userRoute);
app.use("/products", productRoutes);
app.use("/api/kitchen", kitchenRoutes);
app.use("/api/billInfo", billInfoRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/cart", cartRoutes);

const port = process.env.PORT || 5000;

const URL = process.env.MONGODB_URL;

mongoose
    .connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("DB connection success");
    })
    .catch((err) => {
        console.log("DB connection error", err);
    });

app.listen(port, () => {
    console.log(`app is running ${port}`);
});
