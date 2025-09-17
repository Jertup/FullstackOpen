const dummy = (blogs) => {
  return 1;
};
const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.reduce((prev, curr) => {
    return prev.likes > curr.likes ? prev : curr;
  });
};
const mostBlogs = (blogs) => {
  const authorBlogCount = blogs.reduce((count, blog) => {
    count[blog.author] = (count[blog.author] || 0) + 1;
    return count;
  }, {});
  const mostBlogsAuthor = Object.keys(authorBlogCount).reduce((prev, curr) => {
    return authorBlogCount[prev] > authorBlogCount[curr] ? prev : curr;
  });
  return {
    author: mostBlogsAuthor,
    blogs: authorBlogCount[mostBlogsAuthor],
  };
};

const mostLikes = (blogs) => {
  const authorLikesCount = blogs.reduce((count, blog) => {
    count[blog.author] = (count[blog.author] || 0) + blog.likes;
    return count;
  }, {});
  const mostLikesAuthor = Object.keys(authorLikesCount).reduce((prev, curr) => {
    return authorLikesCount[prev] > authorLikesCount[curr] ? prev : curr;
  });
  return {
    author: mostLikesAuthor,
    likes: authorLikesCount[mostLikesAuthor],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
