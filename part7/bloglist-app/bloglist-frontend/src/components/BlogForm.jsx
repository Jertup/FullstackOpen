import { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

const BlogForm = ({ createBlog, visible, setVisible }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' });

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
    });

    setNewBlog({ title: '', author: '', url: '' });
    setVisible(null); // Hide form after successful submission
  };

  return (
    <div>
      {visible ? (
        <Card className="mb-4">
          <Card.Header>
            <h2 className="mb-0">Create a new Blog</h2>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={addBlog}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={newBlog.title}
                  onChange={(event) =>
                    setNewBlog({ ...newBlog, title: event.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Author</Form.Label>
                <Form.Control
                  type="text"
                  value={newBlog.author}
                  onChange={(event) =>
                    setNewBlog({ ...newBlog, author: event.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>URL</Form.Label>
                <Form.Control
                  type="text"
                  value={newBlog.url}
                  onChange={(event) =>
                    setNewBlog({ ...newBlog, url: event.target.value })
                  }
                />
              </Form.Group>
              <Button type="submit" variant="primary" className="me-2">
                Add Blog
              </Button>
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => setVisible(null)}
              >
                Cancel
              </Button>
            </Form>
          </Card.Body>
        </Card>
      ) : (
        <Button 
          variant="success" 
          onClick={() => setVisible('blogForm')}
          className="mb-3"
        >
          New Blog
        </Button>
      )}
    </div>
  );
};

export default BlogForm;
