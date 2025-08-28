const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)


const initialBlogs = [
  {
    title: 'My Blog Post',
    author: 'John Blog',
    url: 'https://example.com/THEONEANDONLY',
    likes: 9
  },
  {
    title: 'Another Blog Post',
    author: 'Jane Doe',
    url: 'https://example.com/another-blog-post',
    likes: 10
  }
]

let token = ''


const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  // Create and login user for token
  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'testpass'
  }
  await api.post('/api/users').send(newUser)
  const loginResponse = await api
    .post('/api/login')
    .send({ username: newUser.username, password: newUser.password })
  token = loginResponse.body.token
  // Add initial blogs with user
  let blogObject = new Blog({ ...initialBlogs[0], user: loginResponse.body.id })
  await blogObject.save()
  blogObject = new Blog({ ...initialBlogs[1], user: loginResponse.body.id })
  await blogObject.save()
})
test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(e => e.title)
  assert.strictEqual(titles.includes('My Blog Post'), true)
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'New Blog Post',
    author: 'New Author',
    url: 'https://example.com/new-blog-post',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const contents = response.body.map(r => r.title)

  assert.strictEqual(response.body.length, initialBlogs.length + 1)

  assert(contents.includes('New Blog Post'))
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'New Author',
    url: 'https://example.com/new-blog-post',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('blog with specific id', async () => {
  const response = await api.get('/api/blogs')

  const blogToView = response.body[0]

  const blogResponse = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(blogResponse.body.id, blogToView.id)
})

test('blog without likes property defaults likes to 0', async () => {
  const newBlog = {
    title: 'Blog Without Likes',
    author: 'No Likes Author',
    url: 'https://example.com/no-likes'
    // likes is intentionally omitted
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('blog without title is not added and returns 400', async () => {
  const newBlog = {
    author: 'Author',
    url: 'https://example.com'
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('blog without url is not added and returns 400', async () => {
  const newBlog = {
    title: 'No URL Blog',
    author: 'Author'
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('delete blog by id', async () => {
  const response = await api.get('/api/blogs')

  const blogToDelete = response.body[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const updatedResponse = await api.get('/api/blogs')
  assert.strictEqual(updatedResponse.body.length, initialBlogs.length - 1)
})


test('edit likes on a blog', async () => {
  const response = await api.get('/api/blogs')
  const blogToEdit = response.body[0]

  const updatedBlog = {
    ...blogToEdit,
    likes: blogToEdit.likes + 1
  }

  const editResponse = await api
    .put(`/api/blogs/${blogToEdit.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(editResponse.body.likes, blogToEdit.likes + 1)
})

// --- TOKEN TEST ---
test('a blog can be added only with a valid token and creator is set', async () => {
  await User.deleteMany({})
  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'testpass'
  }
  await api.post('/api/users').send(newUser)

  const loginResponse = await api
    .post('/api/login')
    .send({ username: newUser.username, password: newUser.password })
  const token = loginResponse.body.token

  const newBlog = {
    title: 'Token Blog',
    author: 'Token Author',
    url: 'https://example.com/token-blog',
    likes: 5
  }
  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.user.username, newUser.username)
})

after(async () => {
  await mongoose.connection.close()
})
