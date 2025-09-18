import { Navbar, Nav, Button } from 'react-bootstrap';

const Navigation = ({ user, onLogout, currentView, setCurrentView }) => {
  if (!user) {
    return null;
  }

  return (
    <Navbar bg="light" className="mb-3 border-bottom">
      <Nav className="me-auto">
        <Button 
          variant={currentView === 'blogs' ? 'primary' : 'outline-primary'}
          onClick={() => setCurrentView('blogs')}
          className="me-3"
        >
          blogs
        </Button>
        <Button 
          variant={currentView === 'users' ? 'primary' : 'outline-primary'}
          onClick={() => setCurrentView('users')}
          className="me-3"
        >
          users
        </Button>
      </Nav>
      <Navbar.Text className="me-3">
        {user.name} logged in
      </Navbar.Text>
      <Button 
        onClick={onLogout}
        variant="danger"
        size="sm"
      >
        logout
      </Button>
    </Navbar>
  );
};

export default Navigation;