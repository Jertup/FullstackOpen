const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}/>
        </label>
      </div>
      <div>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}/>
        </label>
      </div>
      <button type="submit">Login</button>
    </form>

  )
}

export default LoginForm