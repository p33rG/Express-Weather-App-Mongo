const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const schema = mongoose.Schema({
    username: {

        type: String,
        required: true

    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:
    {
        type: String,
        required: true
    },
    tokens:

        [{
            token:
            {
                type: String,
                required: true
            }
        }]

});

schema.pre("save", async function (next) {

    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();

});
//generatting ttokens
schema.methods.generateAuthToken = async function () {
    try {

        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);

        console.log(token);
        
        this.tokens = this.tokens.concat({ token: token })
        await this.save();
        return token;


    } catch (error) {

        console.log(error);
    }
}

//now we need to create a collection

const Register = new mongoose.model("Registration", schema);
module.exports = Register;