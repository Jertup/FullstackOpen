import { createContext, useContext, useReducer } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload
    case 'CLEAR_NOTIFICATION':
      return ''
    default:
      return state
  }
}

export const NotificationProvider = ({ children }) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, 'Welcome to the anecdotes app!')

  const setNotification = (message, duration = 5000) => {
    notificationDispatch({
      type: 'SET_NOTIFICATION',
      payload: message
    })

    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR_NOTIFICATION' })
    }, duration)
  }

  const clearNotification = () => {
    notificationDispatch({ type: 'CLEAR_NOTIFICATION' })
  }

  return (
    <NotificationContext.Provider value={{
      notification,
      setNotification,
      clearNotification
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

export default NotificationContext
