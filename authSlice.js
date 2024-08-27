import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    user: null,
    users: [],
  },
  reducers: {
    register: (state, action) => {
      state.users.push(action.payload);
      AsyncStorage.setItem('users', JSON.stringify(state.users));
    },
    login: (state, action) => {
      const { email, password } = action.payload;
      const foundUser = state.users.find(
        (user) => user.email === email && user.password === password
      );
      if (foundUser) {
        state.isLoggedIn = true;
        state.user = foundUser;
        AsyncStorage.setItem('isLoggedIn', 'true');  // Persist login state
      } else {
        state.isLoggedIn = false;
        state.user = null;
      }
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      AsyncStorage.setItem('isLoggedIn', 'false');  // Update to logged out state
    },
    loadUsers: (state, action) => {
      state.users = action.payload;
    },
    setLoginState: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
});

export const { register, login, logout, loadUsers, setLoginState } = authSlice.actions;

export const loadUsersFromStorage = () => async (dispatch) => {
  try {
    const users = await AsyncStorage.getItem('users');
    if (users) {
      dispatch(loadUsers(JSON.parse(users)));
    }
    const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      dispatch(setLoginState(true));
    }
  } catch (error) {
    console.error('Failed to load users from storage:', error);
  }
};

export default authSlice.reducer;
