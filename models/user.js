const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: "string",
    email: "string",
    password: "string",
    address: "string"
})

const userModel = mongoose.model("User", userSchema)

module.exports = userModel;