import { useState, useEffect } from 'react';
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
    return <div>Loading...</div>;
  }

  // Show individual user view
  if (selectedUser) {
    return (
      <div>
        <h2>{selectedUser.name}</h2>
        <button onClick={handleBackClick}>back</button>
        <h3>added blogs</h3>
        {selectedUser.blogs && selectedUser.blogs.length > 0 ? (
          <ul>
            {selectedUser.blogs.map(blog => (
              <li key={blog.id}>
                {blog.title} by {blog.author}
              </li>
            ))}
          </ul>
        ) : (
          <p>No blogs added yet</p>
        )}
      </div>
    );
  }

  // Show users list view
  return (
    <div>
      <h2>Users</h2>
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <div>
          <table>
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
                    <button 
                      onClick={() => handleUserClick(user)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'blue', 
                        textDecoration: 'underline', 
                        cursor: 'pointer' 
                      }}
                    >
                      {user.name}
                    </button>
                  </td>
                  <td>{user.blogs ? user.blogs.length : 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
