import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError(state, action) {
      return action.payload
    },
    clearError() {
      return ''
    }
  }
})

export const showError = (message, duration = 5000) => {
  return async (dispatch) => {
    dispatch(setError(message))
    setTimeout(() => {
      dispatch(clearError())
    }, duration)
  }
}

export const { setError, clearError } = errorSlice.actions
export default errorSlice.reducer