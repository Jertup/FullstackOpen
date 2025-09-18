import { useState } from 'react';
import { Card, Button, Form, ListGroup, InputGroup } from 'react-bootstrap';

const BlogView = ({ blog, onLike, onDelete, currentUser, onBack, onAddComment }) => {
  const [comment, setComment] = useState('');

  const showDeleteButton =
    currentUser &&
    blog.user &&
    (currentUser.username === blog.user.username ||
      currentUser.id === blog.user.id);

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    if (comment.trim()) {
      onAddComment(blog.id, comment);
      setComment('');
    }
  };

  return (
    <div>
      <Card className="mb-4">
        <Card.Header>
          <h2 className="mb-0">{blog.title}</h2>
          <Button 
            variant="outline-secondary" 
            size="sm" 
            onClick={onBack}
            className="mt-2"
          >
            back
          </Button>
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <a href={blog.url} target="_blank" rel="noopener noreferrer">
              {blog.url}
            </a>
          </Card.Text>
          <Card.Text>
            {blog.likes} likes
            <Button 
              variant="success" 
              size="sm" 
              onClick={() => onLike(blog)}
              className="ms-2"
            >
              like
            </Button>
          </Card.Text>
          <Card.Text>
            added by {blog.user?.name || 'Unknown'}
          </Card.Text>
          {showDeleteButton && (
            <Button 
              variant="danger" 
              size="sm"
              onClick={() => onDelete(blog)}
            >
              remove
            </Button>
          )}
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Header>
          <h3 className="mb-0">comments</h3>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleCommentSubmit}>
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                value={comment}
                onChange={({ target }) => setComment(target.value)}
                placeholder="add a comment..."
              />
              <Button 
                type="submit" 
                variant="primary"
              >
                add comment
              </Button>
            </InputGroup>
          </Form>
          
          <ListGroup variant="flush">
            {blog.comments && blog.comments.length > 0 ? (
              blog.comments.map((comment, index) => (
                <ListGroup.Item key={index}>{comment}</ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item className="text-muted">No comments yet</ListGroup.Item>
            )}
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BlogView;