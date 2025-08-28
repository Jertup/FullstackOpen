const bcrypt = require('bcrypt')
const User = require('../models/user')
const { test, describe, beforeEach } = require('node:test')
const app = require('../app')
const assert = require('node:assert')
const supertest = require('supertest')
const helper = require('./test_helper') // or the correct path to your helper file
const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

})

describe('invalid user creation', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
  })

  test('creation fails with missing username', async () => {
    const newUser = {
      name: 'No Username',
      password: 'validpassword'
    }
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('username and password are required'))

    const users = await helper.usersInDb()
    assert.strictEqual(users.length, 1)
  })

  test('creation fails with short username', async () => {
    const newUser = {
      username: 'ab',
      name: 'Short Username',
      password: 'validpassword'
    }
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('username must be at least 3 characters long'))

    const users = await helper.usersInDb()
    assert.strictEqual(users.length, 1)
  })

  test('creation fails with short password', async () => {
    const newUser = {
      username: 'validuser',
      name: 'Short Password',
      password: '12'
    }
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('password must be at least 3 characters long'))

    const users = await helper.usersInDb()
    assert.strictEqual(users.length, 1)
  })
})