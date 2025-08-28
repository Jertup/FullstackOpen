const blogsRouter = require('express').Router()
const { request } = require('../app')
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user

  const blogData = { ...request.body, user: user._id }
  const blog = new Blog(blogData)

  try {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    const populatedBlog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1, id: 1 })
    response.status(201).json(populatedBlog)
  } catch (error) {
    if (error.name === 'ValidationError') {
      response.status(400).json({ error: error.message })
    } else {
      response.status(500).json({ error: 'Something went wrong' })
    }
  }
})

blogsRouter.get('/:id', async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).end()
    }
    response.json(blog) // No manual transformation needed
  } catch (error) {
    if (error.name === 'CastError') {
      response.status(400).json({ error: 'malformatted id' })
    } else {
      response.status(500).json({ error: 'internal server error' })
    }
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  const user = request.user

  try {
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }
    // Only allow delete if user matches
    if (blog.user && blog.user.toString() !== user._id.toString()) {
      return response.status(403).json({ error: 'only the creator can delete this blog' })
    }
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const { title, author, url, likes } = request.body

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { title, author, url, likes },
      { new: true, runValidators: true }
    )
    if (!updatedBlog) {
      return response.status(404).end()
    }
    response.json(updatedBlog)
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter