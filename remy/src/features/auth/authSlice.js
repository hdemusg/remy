import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loggedIn: false,
    uid: "",
  },
  reducers: {
    logIn: (state, action) => {
      state.loggedIn = true
      state.uid = action.payload
    },
    logOut: (state) => {
      state.loggedIn = false
      state.uid = ""
    },
  },
})

export const { logIn, logOut } = authSlice.actions

export default authSlice.reducer