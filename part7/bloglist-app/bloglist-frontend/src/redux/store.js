import { configureStore } from '@reduxjs/toolkit'

import notificationSlice from './notificationSlice'
import errorSlice from './errorSlice'
import blogSlice from './blogSlice'
import userSlice from './userSlice'

const store = configureStore({
  reducer: {
    notification: notificationSlice,
    error: errorSlice,
    blogs: blogSlice,
    users: userSlice
  }
})

export default store 