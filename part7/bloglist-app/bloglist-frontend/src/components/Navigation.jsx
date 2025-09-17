const Navigation = ({ user, onLogout, currentView, setCurrentView }) => {
  const navStyle = {
    background: '#f0f0f0',
    padding: '10px',
    marginBottom: '10px',
    borderBottom: '1px solid #ccc'
  };

  const linkStyle = {
    marginRight: '15px',
    textDecoration: 'none',
    color: '#007bff',
    cursor: 'pointer',
    padding: '5px 10px',
    border: 'none',
    background: 'none',
    fontSize: 'inherit'
  };

  const activeLinkStyle = {
    ...linkStyle,
    fontWeight: 'bold',
    color: '#0056b3'
  };

  if (!user) {
    return null;
  }

  return (
    <div style={navStyle}>
      <button 
        style={currentView === 'blogs' ? activeLinkStyle : linkStyle}
        onClick={() => setCurrentView('blogs')}
      >
        blogs
      </button>
      <button 
        style={currentView === 'users' ? activeLinkStyle : linkStyle}
        onClick={() => setCurrentView('users')}
      >
        users
      </button>
      <span style={{ marginLeft: '20px' }}>
        {user.name} logged in
        <button 
          onClick={onLogout}
          style={{ 
            marginLeft: '10px',
            padding: '5px 10px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          logout
        </button>
      </span>
    </div>
  );
};

export default Navigation;