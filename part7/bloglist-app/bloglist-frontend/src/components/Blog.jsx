import { Card, Button } from 'react-bootstrap';

const Blog = ({ blog, onBlogClick }) => {
  return (
    <Card className="mb-2">
      <Card.Body className="py-2">
        <Button 
          variant="link" 
          onClick={() => onBlogClick(blog)}
          className="p-0 text-start"
          style={{ textDecoration: 'none' }}
        >
          {blog.title}
        </Button> 
        <span className="text-muted"> by {blog.author}</span>
      </Card.Body>
    </Card>
  );
};

export default Blog;
