import { createOnePost, deleteOnePost, getAllPosts, getOnePost, updateOnePost } from '#Services/postService.js'

// * Controller return all posts

const getAllPostsController = (req, res, next) => {
  getAllPosts()
    .then((data) => res.json({ status: 'OK', data }))
    .catch(error => {
      next(error)
    })
}

// * Controller return one post

const getOnePostController = (req, res, next) => {
  const { postId } = req.params
  getOnePost(postId)
    .then((data) => res.json({ status: 'OK', data }))
    .catch((error) => {
      next(error)
    })
}

// * Create Post

const createPostController = (req, res, next) => {
  const { body, user } = req
  createOnePost(user, body)
    .then((data) => res.status(201).json({ status: 'OK', data }))
    .catch((error) => {
      next(error)
    })
}

// * Controller update data from post

const updatePostController = (req, res, next) => {
  const { body } = req
  updateOnePost(body)
    .then((data) => res.json({ status: 'OK', data }))
    .catch((error) => {
      next(error)
    })
}

// * Delete post

const deletePostController = (req, res, next) => {
  const { user } = req
  const { postId } = req.params
  deleteOnePost(user, postId)
    .then((data) => res.json({ status: 'OK', data }))
    .catch((error) => {
      next(error)
    })
}

export {
  getAllPostsController,
  getOnePostController,
  createPostController,
  updatePostController,
  deletePostController
}
