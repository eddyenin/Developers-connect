const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../model/Post');
const Profile = require('../../model/Profile');
const User = require('../../model/User');

//@route Post api/posts
//@desc  Create post
//@access Private
router.post('/', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async(req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        })

        const post = await newPost.save();

        res.json(post);

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});


//@route Get api/posts
//@desc  Get all posts
//@access Private
router.get('/', auth, async(req, res) => {

    try {
        const posts = await Post.find().sort({ date: -1 });

        if (!posts) {
            return res.status(400).json({ msg: 'Post not found' });
        }

        res.json(posts);

    } catch (err) {
        console.log(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'post not found' });
        }
        res.status(500).send('Server Error');
    }
});


//@route Get api/posts/:id
//@desc  Delete posts by Id
//@access Private
router.get('/', auth, async(req, res) => {

    try {
        const posts = await Post.findById(req.params.id);

        if (!posts) {
            return res.status(400).json({ msg: 'Post not found' });
        }


        //check user
        if (!post.user.toString() != req.user.id) {
            res.status(400).json({ msg: 'User not authorized' });
        }

        await Post.remove();
        res.json({ msg: 'Post removed' });

    } catch (err) {
        console.log(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'post not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;