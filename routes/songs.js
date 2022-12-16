const router = require('express').Router();
const {User} = require('../models/user');
const {Song, validate} = require('../models/song');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validObjectId');

// create song
router.post('/', admin, async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send({message: error.details[0].message});

    const song = await new Song({
        ...req.body
    }).save();

    res.status(200).send({data: song, message: "Song created successfully"});
});

// get all songs
router.get('/', async (req, res) => {
    const songs = await Song.find().lean();
    res.status(200).send({data: songs});
});

//update song by id
router.put('/:id', [validateObjectId, admin], async (req, res) => { 
    const song = await Song.findByIdAndUpdate(req.params.id, {$set
        : req.body}, {new: true}).lean();
    res.status(200).send({data: song, message: "Song updated successfully"});
});


// delete song by id
router.delete('/:id', [validateObjectId, admin], async (req, res) => {
    const song = await Song.findByIdAndRemove(req.params.id).lean();
    res.status(200).send({data: song, message: "Song deleted successfully"});
});


//like song by id
router.put('/like/:id', [validateObjectId, auth], async (req, res) => { 
   let Message = "";
    const song = await Song.findById(req.params.id);
    if(!song) return res.status(404).send({message: "Song not found"}); 
    const user = await User.findById(req.user._id);
    const index = song.likes.indexOf(user._id);
    if(index === -1) {user.likedSongs.push(user._id);
        Message = "Added to your liked songs"
} else {
    user.likedSongs.splice(index, 1);
}
    res.status(200).send({data: song, message : Message});
});

//get all liked songs
router.get('/liked', [auth], async (req, res) => { 
    const user = await User.findById(req.user._id);
    const songs = await Song.find({_id: {$in: user.likedSongs}}).lean();
    res.status(200).send({data: songs});
});

module.exports = router;