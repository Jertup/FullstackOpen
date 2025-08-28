import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

test('renders content but not url and likes', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 5
  }
  render(<Blog blog={blog} />)

  // Check title and author are rendered
  const titleAuthor = screen.getByText('Component testing is done with react-testing-library by John Doe')
  expect(titleAuthor).toBeInTheDocument()

  // Check URL and likes are NOT rendered by default
  expect(screen.queryByText('https://example.com')).toBeNull()
  expect(screen.queryByText(/likes:/)).toBeNull()
})

test('shows URL and likes when view button is clicked', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 5
  }

  render(
    <Blog blog={blog} visible={true} />
  )

  expect(screen.getByText('URL: https://example.com')).toBeInTheDocument()
  expect(screen.getByText('Likes: 5')).toBeInTheDocument()
})

test('<BlogForm /> updates parent state and calls on Submit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(
    <BlogForm createBlog={createBlog} setVisible={vi.fn()} visible={true} />
  )

  const inputs = screen.getAllByRole('textbox');
  const sendButton = screen.getByText('Add Blog');

  await user.type(inputs[0], 'Test Title');
  await user.type(inputs[1], 'Test Author');
  await user.type(inputs[2], 'Test URL');
  await user.click(sendButton);

  expect(createBlog).toHaveBeenCalledTimes(1);
  expect(createBlog.mock.calls[0][0].title).toBe('Test Title');
  expect(createBlog.mock.calls[0][0].author).toBe('Test Author');
  expect(createBlog.mock.calls[0][0].url).toBe('Test URL');
})

test('calls like handler twice when like button is clicked twice', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 5,
    handleLike: vi.fn()
  }

  const user = userEvent.setup()

  render(
    <Blog blog={blog} visible={true} />
  )

  const likeButton = screen.getByText('like')
  
  await user.click(likeButton)
  await user.click(likeButton)

  expect(blog.handleLike).toHaveBeenCalledTimes(2)
})