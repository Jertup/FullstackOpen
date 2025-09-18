import { useState, useEffect } from 'react';
import { Card, Button, Table, ListGroup, Spinner } from 'react-bootstrap';
import usersService from '../services/users';

const UserInfo = ({ showNotification, showError }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await usersService.getAll();
        setUsers(userData);
      } catch (error) {
        console.error('Error fetching users:', error);
        if (showError) {
          showError('Failed to fetch users');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [showError]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleBackClick = () => {
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  // Show individual user view
  if (selectedUser) {
    return (
      <Card>
        <Card.Header>
          <h2 className="mb-0">{selectedUser.name}</h2>
          <Button 
            variant="outline-secondary" 
            size="sm" 
            onClick={handleBackClick}
            className="mt-2"
          >
            back
          </Button>
        </Card.Header>
        <Card.Body>
          <h3>added blogs</h3>
          {selectedUser.blogs && selectedUser.blogs.length > 0 ? (
            <ListGroup variant="flush">
              {selectedUser.blogs.map(blog => (
                <ListGroup.Item key={blog.id}>
                  {blog.title} by {blog.author}
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p className="text-muted">No blogs added yet</p>
          )}
        </Card.Body>
      </Card>
    );
  }

  // Show users list view
  return (
    <Card>
      <Card.Header>
        <h2 className="mb-0">Users</h2>
      </Card.Header>
      <Card.Body>
        {users.length === 0 ? (
          <p className="text-muted">No users found</p>
        ) : (
          <Table striped hover>
            <thead>
              <tr>
                <th></th>
                <th>blogs created</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>
                    <Button 
                      variant="link" 
                      onClick={() => handleUserClick(user)}
                      className="p-0"
                      style={{ textDecoration: 'none' }}
                    >
                      {user.name}
                    </Button>
                  </td>
                  <td>{user.blogs ? user.blogs.length : 0}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};

export default UserInfo;
