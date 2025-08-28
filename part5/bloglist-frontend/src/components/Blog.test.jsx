import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 5
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('Component testing is done with react-testing-library by John Doe')
  expect(element).toBeDefined()
})