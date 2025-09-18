import { createSlice, current } from '@reduxjs/toolkit'
import blogService from '../services/blogs'



const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    updateBlog(state, action) {
      const updated = action.payload
      return state.map(blog =>
        blog.id === updated.id ? updated : blog
      )
    },
    deleteBlog(state, action) {
      const id = action.payload
      return state.filter(blog => blog.id !== id)
    }
  },
})

export const { appendBlog, setBlogs, updateBlog, deleteBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = content => {
  return async dispatch => {
    const newBlog = await blogService.create(content)
    dispatch(appendBlog(newBlog))
  }
}

// Async thunk for voting
export const voteBlog = (id) => {
  return async (dispatch, getState) => {
    const blogToVote = getState().blogs.find(b => b.id === id)
    const updatedBlog = { 
      ...blogToVote, 
      likes: blogToVote.likes + 1,
      user: blogToVote.user?.id || blogToVote.user // Send only user ID to backend
    }
    const returnedBlog = await blogService.update(id, updatedBlog)
    
    // Preserve the original user object from the frontend state
    const blogWithUser = {
      ...returnedBlog,
      user: blogToVote.user // Keep the original user object
    }
    dispatch(updateBlog(blogWithUser))
  }
}

// Async thunk for deleting
export const removeBlog = (id) => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch(deleteBlog(id))
  }
}

// Async thunk for adding comments
export const addComment = (id, comment) => {
  return async dispatch => {
    const updatedBlog = await blogService.addComment(id, comment)
    dispatch(updateBlog(updatedBlog))
  }
}

export default blogSlice.reducer