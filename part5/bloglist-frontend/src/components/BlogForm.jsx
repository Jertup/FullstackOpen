import { useState } from 'react'

const BlogForm = ({ createBlog, visible, setVisible }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url
    })

    setNewBlog({ title: '', author: '', url: '' })
    setVisible(null) // Hide form after successful submission
  }

  return (
    <div>
      {visible ? (
        <div>
          <h2>Create a new Blog</h2>
          <form onSubmit={addBlog}>
            <div>
              <label>
                Title
                <input
                  type="text"
                  value={newBlog.title}
                  onChange={event => setNewBlog({ ...newBlog, title: event.target.value })}
                />
              </label>
            </div>
            <div>
              <label>
                Author
                <input
                  type="text"
                  value={newBlog.author}
                  onChange={event => setNewBlog({ ...newBlog, author: event.target.value })}
                />
              </label>
            </div>
            <div>
              <label>
                URL
                <input
                  type="text"
                  value={newBlog.url}
                  onChange={event => setNewBlog({ ...newBlog, url: event.target.value })}
                />
              </label>
            </div>
            <button type="submit">Add Blog</button>
            <button type="button" onClick={() => setVisible(null)}>Cancel</button>
          </form>
        </div>
      ) : (
        <button onClick={() => setVisible('blogForm')}>New Blog</button>
      )}
    </div>
  )
}

export default BlogForm
