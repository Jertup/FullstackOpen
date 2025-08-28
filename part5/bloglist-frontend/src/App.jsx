import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [notification, setNotification] = useState(null)
  const [visibleComponent, setVisibleComponent] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [user])

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification(`Welcome ${user.name}!`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  const createBlog = (blogObject) => {
    blogService.create(blogObject).then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
      //Notification and errors
      setNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }).catch(() => {
      setErrorMessage('Failed to add blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    })
  }

  const handleLike = (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user?.id || blog.user  // Handle user reference properly
    }

    blogService.update(blog.id, updatedBlog).then(returnedBlog => {
      // Preserve the user object from the original blog since backend might not send it.
      const blogWithUser = {
        ...returnedBlog,
        user: blog.user  // Keep original posted instead of showing Unknown
      }
      setBlogs(blogs.map(b => b.id === blog.id ? blogWithUser : b))
    }).catch(() => {
      setErrorMessage('Failed to update blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    })
  }
  const handleDelete = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      blogService.remove(blog.id).then(() => {
        setBlogs(blogs.filter(b => b.id !== blog.id))
      }).catch(() => {
        setErrorMessage('Failed to delete blog')
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
      })
    }
  }

  const loginForm = () => (
    <LoginForm
      handleSubmit={handleLogin}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      username={username}
      password={password}
    />
  )

  const blogList = () => (
    <div>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog
            key={blog.id}
            blog={ { ...blog, handleLike, handleDelete }}
            visible={visibleComponent === `showBlog${blog.id}`}
            setVisible={setVisibleComponent}
          />
        )}
    </div>
  )

  return (
    <>
      <h1>Blogs</h1>
      {notification && <div style={ { color: 'green', border: '1px solid green', padding: '10px', marginBottom: '10px' }}>{notification}</div>}
      {errorMessage && <div style={ { color: 'red', border: '1px solid red', padding: '10px', marginBottom: '10px' }}>{errorMessage}</div>}
      {!user && (
        <div>
          {visibleComponent === 'login' ? (
            <div>
              {loginForm()}
              <button onClick={() => setVisibleComponent(null)}>Cancel</button>
            </div>
          ) : (
            <button onClick={() => setVisibleComponent('login')}>Login</button>
          )}
        </div>
      )}
      {user && (
        <div>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          <BlogForm
            createBlog={createBlog}
            visible={visibleComponent === 'blogForm'}
            setVisible={setVisibleComponent}
          />
          {blogList()}
        </div>
      )}
    </>
  )
}

export default App