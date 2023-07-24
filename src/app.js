require('dotenv').config();
const express = require("express");
const { stat } = require("fs");
const path = require("path");
const hbs = require("hbs");
const bcryptt = require("bcryptjs");

const cookie = require("cookie-parser");

require("../src/database/connection");
const app = express();


const Register = require("./models/register");
const cookieParser = require('cookie-parser');
const static_port = path.join(__dirname, "../public")
app.use(express.static(static_port));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const template_path = path.join(__dirname, "../templetes/views");
const partials_path = path.join(__dirname, "../templetes/partials");
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);
app.use(cookieParser());
const port = process.env.port || 8000;

app.get("/", (req, res) => {
    // res.send("this is my first page");
    res.render("index");
});
app.get("/login", (req, res) => {
    // res.send("this is my first page");
    res.render("login");
});
app.get("/Register", (req, res) => {
    // res.send("this is my first page");
    res.render("registration");
});
app.post("/Register", async (req, res) => {
    try {
        const newRegister = new Register({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });

        const ttoken = await newRegister.generateAuthToken();
        res.cookie('jwt', ttoken, {
            expires: new Date(date.now() + 30000),
            httpOnly: true
        });
        const reg = await newRegister.save();
        console.log(req.body.username);
        res.status(201).render("index");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while registering.");
    }
});

app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const result = await Register.findOne(({ email: email }));
        const inMatch = await bcryptt.compare(password, result.password);
        const token = await email.generateAuthToken();
        console.log(token);
        if (inMatch) {
            // console.log(inMatch);

            res.status(201).render("index");
        }
        else {
            res.send("Invalid loogin Details");
        }

    } catch (error) {
        res.status(400).send("Invalid Login Details");

    }
});


app.listen(port, () => {
    console.log(`server is running on port ${port}`);
}) 