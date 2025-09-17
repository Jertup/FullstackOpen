import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { showNotification } from './redux/notificationSlice';
import { showError } from './redux/errorSlice';
import { initializeBlogs, createBlog, voteBlog, removeBlog } from './redux/blogSlice';
import { setUser, clearUser } from './redux/userSlice';
import Blog from './components/Blog';
import BlogView from './components/BlogView';
import Navigation from './components/Navigation';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import UserInfo from './components/UserInfo';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [visibleComponent, setVisibleComponent] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [currentView, setCurrentView] = useState('blogs');
  
  const blogs = useSelector(state => state.blogs);
  const user = useSelector(state => state.users);
  const notification = useSelector(state => state.notification);
  const errorMessage = useSelector(state => state.error);
  const dispatch = useDispatch();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(initializeBlogs());
    }
  }, [user, dispatch]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(setUser(user));
      setUsername('');
      setPassword('');
      dispatch(showNotification(`Welcome ${user.name}!`));
    } catch {
      dispatch(showError('Wrong credentials'));
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    dispatch(clearUser());
    blogService.setToken(null);
    setCurrentView('blogs');
    setSelectedBlog(null);
  };

  const createBlogHandler = async (blogObject) => {
    try {
      await dispatch(createBlog(blogObject));
      dispatch(showNotification(
        `a new blog ${blogObject.title} by ${blogObject.author} added`
      ));
    } catch (error) {
      dispatch(showError('Failed to add blog'));
    }
  };

  const handleLike = async (blog) => {
    try {
      await dispatch(voteBlog(blog.id));
    } catch (error) {
      dispatch(showError('Failed to update blog'));
    }
  };
  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await dispatch(removeBlog(blog.id));
      } catch (error) {
        dispatch(showError('Failed to delete blog'));
      }
    }
  };

  const handleBlogClick = (blog) => {
    setSelectedBlog(blog);
  };

  const handleBackFromBlog = () => {
    setSelectedBlog(null);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    setSelectedBlog(null);
    setVisibleComponent(null);
  };

  const renderBlogsView = () => (
    <>
      <h2>blogs</h2>
      <BlogForm
        createBlog={createBlogHandler}
        visible={visibleComponent === 'blogForm'}
        setVisible={setVisibleComponent}
      />
      <div>
        {[...blogs]
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              onBlogClick={handleBlogClick}
            />
          ))}
      </div>
    </>
  );

  const renderUsersView = () => (
    <UserInfo 
      showNotification={(message) => dispatch(showNotification(message))}
      showError={(message) => dispatch(showError(message))}
    />
  );

  const loginForm = () => (
    <LoginForm
      handleSubmit={handleLogin}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      username={username}
      password={password}
    />
  );

  return (
    <>
      <h1>Blog app</h1>
      
      <Navigation 
        user={user}
        onLogout={handleLogout}
        currentView={currentView}
        setCurrentView={handleViewChange}
      />

      {notification && (
        <div
          style={{
            color: 'green',
            border: '1px solid green',
            padding: '10px',
            marginBottom: '10px',
          }}
        >
          {notification}
        </div>
      )}
      {errorMessage && (
        <div
          style={{
            color: 'red',
            border: '1px solid red',
            padding: '10px',
            marginBottom: '10px',
          }}
        >
          {errorMessage}
        </div>
      )}
      
      {!user && (
        <div>
          {visibleComponent === 'login' ? (
            <div>
              {loginForm()}
              <button onClick={() => setVisibleComponent(null)}>Cancel</button>
            </div>
          ) : (
            <button onClick={() => setVisibleComponent('login')}>Login</button>
          )}
        </div>
      )}
      
      {user && (
        <div>
          {selectedBlog ? (
            <BlogView
              blog={selectedBlog}
              onLike={handleLike}
              onDelete={handleDelete}
              currentUser={user}
              onBack={handleBackFromBlog}
            />
          ) : (
            <>
              {currentView === 'blogs' && renderBlogsView()}
              {currentView === 'users' && renderUsersView()}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default App;
