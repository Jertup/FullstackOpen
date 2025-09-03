import { createSlice } from '@reduxjs/toolkit'

const initialState = 'Welcome to the anecdotes app!'

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return ''
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions

// Thunk action creator for timed notifications
export const showNotification = (message, duration = 5000) => {
  return async (dispatch) => {
    dispatch(setNotification(message))
    setTimeout(() => {
      dispatch(clearNotification())
    }, duration)
  }
}

export default notificationSlice.reducer
