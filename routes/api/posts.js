const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// used for protected routes
const passport = require('passport');

// Model
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// Validation
const validatePostInput = require('../../validation/posts');

// @route  GET api api/posts/test
// @desc   Tests post route
// @access Public route
router.get('/test', (request, response) => res.json({ msg: "Posts Works" }));


// @route  POST api api/posts
// @desc   Create post
// @access Private route
router.post('/', passport.authenticate('jwt', { session: false }), (request, response) => {
  const { errors, isValid } = validatePostInput(request.body);
  // Check Validation
  if (!isValid) {
    // Id any errors, send 400 with errors object
    return response.status(400).json(errors);
  }

  const newPost = new Post({
    text: request.body.text,
    name: request.body.name,
    avatar: request.body.avatar,
    user: request.user.id
  });

  newPost
    .save()
    .then(post => response.json(post));
});


// @route  GET api api/posts
// @desc   Get posts
// @access Public route
router.get('/', (req, response) => {
  Post.find()
    // sort descending, mogoose methods
    .sort({ date: -1 })
    .then(posts => response.json(posts))
    .catch(error => response.status(404).json({ nopostsfound: 'No posts found with that ID' }));
});


// @route  GET api api/posts/id
// @desc   Get post by id
// @access Public route
router.get('/:id', (request, response) => {
  Post.findById(request.params.id)
    .then(post => response.json(post))
    .catch(error => response.status(404).json({ nopostfound: 'No posts found' }));
});



// @route  DELETE api api/posts/:id
// @desc   Delete a post
// @access Private route
router.delete('/:id', passport.authenticate('jwt', { session: false }), (request, response) => {
  // make sure that the user that delete this post is the owner
  // request.user.id is the current user
  Profile.findOne({ user: request.user.id })
    .then(profile => {
      Post.findById(request.params.id)
        .then(post => {
          // Check for the post owner
          // Post model has a user field
          // request.user.id is the current, the logged in user
          if (post.user.toString() !== request.user.id) {
            return response.status(401).json({ notauthorized: 'User not authorized' })
          }
          // Else
          // Delete
          post.remove().then(() => response.json({ success: true }));
        })
        .catch(error => response.status(404).json({ postnotfound: 'No post found' }));
    })
});


// @route  POST api api/posts/like/:id
// @desc   Like a post
// @access Private route
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (request, response) => {
  Profile.findOne({ user: request.user.id })
    .then(profile => {
      Post.findById(request.params.id)
        .then(post => {
          // Check if the user liked already the post
          // > 0 means the user already liked it
          // because his ID is already in likes array
          const userLiked = post.likes.filter(like => {
            return like.user.toString() === request.user.id
          });

          if (userLiked.length > 0) {
            return response.status(400).json({ alreadyliked: 'User already liked this post' });
          }
          // Else
          // Add the user id to likes array
          post.likes.unshift({ user: request.user.id });

          // Save it to database
          post.save().then(post => response.json(post));
        })
        .catch(error => response.status(404).json({ postnotfound: 'No post found' }));
    })
});


// @route  POST api api/posts/unlike/:id
// @desc   Unlike a post
// @access Private route
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (request, response) => {
  Profile.findOne({ user: request.user.id })
    .then(profile => {
      Post.findById(request.params.id)
        .then(post => {
          // Check if the user liked already the post
          // === 0 means the user is not in likes array
          const userNotliked = post.likes.filter(like => {
            return like.user.toString() === request.user.id
          });

          if (userNotliked.length === 0) {
            return response.status(400).json({ notliked: 'You have not yet liked this post' });
          }

          // Else
          // Get the remove index
          // this will return the current user that we want to remove
          const removeIndex = post.likes
            .map(item => item.user.toString())
            // the current user
            .indexOf(request.user.id);

          // Splice out of the array
          post.likes.splice(removeIndex, 1);

          // Save it to database
          post.save().then(post => response.json(post));
        })
        .catch(error => response.status(404).json({ postnotfound: 'No post found' }));
    })
});


// @route  POST api api/posts/comment/:id
// @desc   Add comment to a post
// @access Private route
// :id is the post ID because we need to know witch post 
// we are going to have a comment
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (request, response) => {
  const { errors, isValid } = validatePostInput(request.body);
  // Check Validation
  if (!isValid) {
    // Id any errors, send 400 with errors object
    return response.status(400).json(errors);
  }

  Post.findById(request.params.id)
    .then(post => {
      const newComment = {
        text: request.body.text,
        name: request.body.name,
        avatar: request.body.avatar,
        user: request.user.id
      }

      // Add to comments array
      post.comments.unshift(newComment);

      // Save to database
      post.save().then(post => response.json(post));
    })
    .catch(error => response.status(404).json({ postnotfound: 'No post found' }));
});


// @route  DELETE api api/posts/comment/:id/:comment_id
// @desc   Delete comment to a post
// @access Private route
// :id is the post ID because we need to know witch post is
// :comment_id is the comment ID because we need to know what comment to delete
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (request, response) => {
  Post.findById(request.params.id)
    .then(post => {
      // Check to see if the comment exists
      // if this is true means the comment doens't exists
      const commentToDelete = post.comments.filter(comment => {
        return comment._id.toString() === request.params.comment_id;
      });

      // === 0 means that the comment is not in the array
      if (commentToDelete.length === 0) {
        return response.status(404).json({ commentnotexists: 'This comment does not exists' });
      }

      // Get the remove index
      // this will give the current comment to remove
      const removeIndex = post.comments
        .map(item => item._id.toString())
        .indexOf(request.params.comment_id);

      // Splice out of the array to remove it
      post.comments.splice(removeIndex, 1);

      // Save it to database
      post.save().then(post => response.json(post));
    })
    .catch(error => response.status(404).json({ postnotfound: 'No post found' }));
});

module.exports = router;