const Blog = ({ blog, visible, setVisible, currentUser }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showDeleteButton = currentUser && blog.user && 
    (currentUser.username === blog.user.username || currentUser.id === blog.user.id)

  return (
    <div style={blogStyle}>
      <div className="blog-title-author">
        {blog.title} by {blog.author}
        {visible ? (
          <button onClick={() => setVisible(null)}>hide</button>
        ) : (
          <button onClick={() => setVisible(`showBlog${blog.id}`)}>view</button>
        )}
      </div>
      {visible && (
        <div className="blog-details">
          <div>URL: {blog.url}</div>
          <div>
            Likes: {blog.likes}
            <button onClick={() => blog.handleLike(blog)}>like</button>
          </div>
          <div>Posted by: {blog.user?.name || 'Unknown'}</div>
          {showDeleteButton && (
            <button onClick={() => blog.handleDelete(blog)}>Delete</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog