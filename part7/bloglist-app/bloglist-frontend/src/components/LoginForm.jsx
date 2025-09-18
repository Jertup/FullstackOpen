import { Form, Button } from 'react-bootstrap';

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}) => {
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control 
          type="text" 
          value={username} 
          onChange={handleUsernameChange} 
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </Form.Group>
      <Button type="submit" variant="primary">
        Login
      </Button>
    </Form>
  );
};

export default LoginForm;
