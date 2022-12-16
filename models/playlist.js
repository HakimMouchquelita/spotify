const mongoose = require('mongoose');
const Joi = require("joi");

const ObjectId = mongoose.Schema.Types.ObjectId;

// create a schema for the playlist
const playlistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    songs: [{ type: Array, default: [] }],
    user: { type: ObjectId, ref: 'User', required: true },
});

// create a virtual property to get the total number of songs in the playlist
const validate = (playList) => {
	const schema = Joi.object({
		name: Joi.string().required(),
		songs: Joi.string().required(),
		user: Joi.string().required(),
	});
	return schema.validate(playList);
};

const Playlist = mongoose.model('playlist', playlistSchema);

module.exports = {Playlist, validate};