const mongoose = require("mongoose");
const Joi = require("joi");

// create a schema for the song
const songSchema = new mongoose.Schema({
    title:{type:String, required:true},
    url:{type:String, required:true},
    rating:{type:Number, required:true},
    artist:{type:String, required:true},
});

// create a virtual property to get the total number of songs in the playlist
const validate = (song) => {
	const schema = Joi.object({
		title: Joi.string().required(),
		url: Joi.string().required(),
		rating: Joi.number().required(),
		artist: Joi.string().required(),
	});
	return schema.validate(song);
};
 
const Song = mongoose.model("song", songSchema);

module.exports = {Song, validate};