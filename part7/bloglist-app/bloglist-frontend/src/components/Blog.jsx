const Blog = ({ blog, onBlogClick }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <div className="blog-title-author">
        <button 
          onClick={() => onBlogClick(blog)}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'blue', 
            textDecoration: 'underline', 
            cursor: 'pointer',
            padding: 0,
            font: 'inherit'
          }}
        >
          {blog.title}
        </button> by {blog.author}
      </div>
    </div>
  );
};

export default Blog;
