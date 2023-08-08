import postService from '#Services/postService.js'

// * Controller return all posts

const getAllPosts = (req, res, next) => {
  postService
    .getAllPosts()
    .then((data) => res.json({ status: 'OK', data }))
    .catch(error => {
      next(error)
    })
}

// * Controller return one post

const getOnePost = (req, res, next) => {
  const { postId } = req.params
  postService
    .getOnePost(postId)
    .then((data) => res.json({ status: 'OK', data }))
    .catch((error) => {
      next(error)
    })
}

// * Create Post

const createPost = (req, res, next) => {
  const { body, userId } = req
  postService.createOnePost(userId, body)
    .then((data) => res.json({ status: 'OK', data }))
    .catch((error) => {
      next(error)
    })
}

// * Controller update data from post

const updatePost = (req, res, next) => {
  const { body, userId } = req
  postService
    .updateOnePost(userId, body)
    .then((data) => res.json({ status: 'OK', data }))
    .catch((error) => {
      next(error)
    })
}

// * Delete post

const deletePost = (req, res, next) => {
  const { userId } = req
  const { postId } = req.params
  postService
    .deleteOnePost(userId, postId)
    .then((data) => res.json({ status: 'OK', data }))
    .catch((error) => {
      next(error)
    })
}

export {
  getAllPosts,
  getOnePost,
  createPost,
  updatePost,
  deletePost
}
