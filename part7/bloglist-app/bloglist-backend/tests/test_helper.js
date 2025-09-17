const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [
  {
    title: 'My Blog Post',
    author: 'John Blog',
    url: 'https://example.com/THEONEANDONLY',
    likes: 9,
  },
  {
    title: 'Another Blog Post',
    author: 'Jane Doe',
    url: 'https://example.com/another-blog-post',
    likes: 10,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    author: 'Temp',
    url: 'http://temp.com',
    likes: 0,
  });
  await blog.save();
  await blog.deleteOne();
  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
};
