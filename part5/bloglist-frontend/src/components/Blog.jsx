const Blog = ({ blog, visible, setVisible }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} by {blog.author}
        {visible ? (
          <button onClick={() => setVisible(null)}>hide</button>
        ) : (
          <button onClick={() => setVisible(`showBlog${blog.id}`)}>view</button>
        )}
      </div>
      {visible && (
        <div>
          <div>URL: {blog.url}</div>
          <div>
            Likes: {blog.likes}
            <button onClick={() => blog.handleLike(blog)}>like</button>
          </div>
          <div>Posted by: {blog.user?.name || 'Unknown'}</div>
          <button onClick={() => blog.handleDelete(blog)}>Delete</button>
        </div>
      )}
    </div>
  )
}

export default Blog