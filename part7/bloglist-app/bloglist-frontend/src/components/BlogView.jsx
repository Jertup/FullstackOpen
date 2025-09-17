const BlogView = ({ blog, onLike, onDelete, currentUser, onBack }) => {
  const showDeleteButton =
    currentUser &&
    blog.user &&
    (currentUser.username === blog.user.username ||
      currentUser.id === blog.user.id);

  return (
    <div>
      <h2>{blog.title}</h2>
      <button onClick={onBack}>back</button>
      <div>
        <a href={blog.url} target="_blank" rel="noopener noreferrer">
          {blog.url}
        </a>
      </div>
      <div>
        {blog.likes} likes
        <button onClick={() => onLike(blog)}>like</button>
      </div>
      <div>added by {blog.user?.name || 'Unknown'}</div>
      {showDeleteButton && (
        <button onClick={() => onDelete(blog)}>remove</button>
      )}
    </div>
  );
};

export default BlogView;