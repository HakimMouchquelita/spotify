const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");


// create a schema for the user
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password:{type:String, required:true},
  role: { default: 2, required: true, type: Number },
});


// create a virtual property to get the total number of songs in the playlist
userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign(
		{ _id: this._id, email: this.email, role: this.role },
		process.env.JWTPRIVATEKEY,
		{ expiresIn: "7d" }
	);
	return token;
};

// create a virtual property to get the total number of songs in the playlist
const validate = (user) => {
	const schema = Joi.object({
		firstName: Joi.string().min(3).max(10).required(),
		lastName: Joi.string().min(3).max(20).required(),
		email: Joi.string().email().required(),
        password: passwordComplexity().required(),
		role: Joi.string().required(),
	});
	return schema.validate(user);
};

  const User = mongoose.model("user", userSchema);


module.exports = {User, validate};
