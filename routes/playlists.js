const router = require('express').Router();
const {Playlist, validate} = require('../models/playlist');
const {Song} = require('../models/song');
const {User} = require('../models/user');
const auth = require('../middleware/auth');
const validObjectId = require('../middleware/validObjectId');
const Joi = require("joi");

// create playlist
router.post('/', auth, async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send({message: error.details[0].message});

    const user = await User.findById(req.user._id);
    const playlist = await Playlist({
        ...req.body, user: user._id
    }).save();

    res.status(200).send({data: playlist, message: "Playlist created successfully"});
}); 

// edit playlist by id
router.put("/edit/:id", [auth, validObjectId], async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        songs: Joi.string().min(3).max(255).required(),
        user: Joi.array().items(Joi.objectId()).required()
    });
  const { error } = schema.validate(req.body);
    if (error) return res.status(400).send({message: error.details[0].message});
    const playlist = await Playlist.findByIdAndUpdate(req.params.id);
    if(!playlist) return res.status(404).send({message: "Playlist not found"});
    const user = await User.findById(req.user._id);
    if(!user._id.equals(playlist.user)) return res.status(403).send({message: "Access denied"});

    playlist.name = req.body.name;
    playlist.songs = req.body.songs;
    playlist.user = req.body.user;
    await playlist.save();

    res.status(200).send({data: playlist, message: "Playlist updated successfully"});
});

//add song to playlist
router.put("/add", [auth, validObjectId], async (req, res) => {
    const schema = Joi.object({
        playlistId: Joi.objectId().required(),
        songId: Joi.objectId().required()
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send({message: error.details[0].message});

    const user = await User.findById(req.user._id);
    const playlist = await Playlist.findById(req.body.playlistId);
    if(!user._id.equals(playlist.user)) return res.status(404).send({message: "Playlist not found"});

    if(playlist.songs.indexOf(req.body.songId) === -1) 
    {
        playlist.songs.push(req.body.songId);
        await playlist.save();
        res.status(200).send({data: playlist, message: "Song added to playlist successfully"})
    }
});

//remove song from playlist
router.put("/remove", [auth, validObjectId], async (req, res) => {
    const schema = Joi.object({
        playlistId: Joi.objectId().required(),
        songId: Joi.objectId().required()
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send({message: error.details[0].message});
    
    const user = await User.findById(req.user._id);
    const playlist = await Playlist.findById(req.body.playlistId);
    if(!user._id.equals(playlist.user)) return res.status(404).send({message: "User don't have acces to remove the Playlist"});

    const index = playlist.songs.indexOf(req.body.songId);
    playlist.songs.splice(index, 1);
    await playlist.save();
    res.status(200).send({data: playlist, message: "Song removed from playlist successfully"});

});


// user favorite playlist
router.get("/favourite", auth, async (req, res) => {
    const user= await User.findById(req.user._id);
    const playlist = await Playlist.findById(user.favouritePlaylist);
    res.status(200).send({data: playlist, message: "User favourite playlist"});
});

//get random playlists by user id
router.get("/random/:id", [auth, validObjectId], async (req, res) => {
    const playlists = await Playlist.aggregate([{$sample:{size:10}}]);
    res.status(200).send({data: playlists, message: "Random playlists"});
});

//get playlists by user id and songs
router.get("/:id", [auth, validObjectId], async (req, res) => {
    const playlists = await Playlist.find({user: req.params.id});
    if(!playlists) return res.status(404).send({message: "Playlists not found"});

    const songs = await Song.find({_id: playlist.songs});
    res.status(200).send({data: {playlists, songs}, message: "Playlists and songs"});
});

//get all playlists
router.get("/all", auth, async (req, res) => {
    const playlists = await Playlist.find();
    res.status(200).send({data: playlists, message: "All playlists"});
});

//delete playlist by id
router.delete("/:id", [auth, validObjectId], async (req, res) => {
    const playlist = await Playlist.findById(req.params.id);
    const user = await User.findById(req.user._id);
    if(!user._id.equals(playlist.user)) return res.status(403).send({message: "Access denied"});

    const index = User.playlist.indexOf(req.params.id);
    user.playlist.splice(index, 1);
    await user.save();
    await playlist.remove();
    res.status(200).send({data: playlist, message: "Playlist deleted successfully"});
});




module.exports = router;