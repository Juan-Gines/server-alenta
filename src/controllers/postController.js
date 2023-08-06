import postService from '#Services/postService.js'

// * Controller return all users

const getAllPosts = (req, res, next) => {
  postService
    .getAllPosts()
    .then((data) => res.json({ status: 'OK', data }))
    .catch(error => {
      next(error)
    })
}

// * Controller return one user

const getOnePost = async (req, res, next) => {
  const { postId } = req.params
  postService
    .getOnePost(postId)
    .then((data) => res.json({ status: 'OK', data }))
    .catch((error) => {
      next(error)
    })
}

// * Create Post

const createPost = async (req, res, next) => {
  const { body, userId } = req
  postService
    .createOnePost(userId, body)
    .then((data) => res.status(201).json({ status: 'OK', data }))
    .catch((error) => {
      next(error)
    })
}

// * Controller update personal data user

const updatePost = (req, res, next) => {
  const { body, userId } = req
  postService
    .updateOnePost(userId, body)
    .then((data) => res.json({ status: 'OK', data }))
    .catch((error) => {
      next(error)
    })
}

// * Delete user

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