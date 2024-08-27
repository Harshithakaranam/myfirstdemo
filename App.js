import React, { useEffect } from 'react';
import { AppRegistry, View } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './redux/store';
import FloatingActionButton from './components/FloatingActionButton';
import LoginScreen from './components/LoginScreen';
import { name as appName } from './app.json';
import Toast from 'react-native-toast-message';
import { loadUsersFromStorage } from './redux/authSlice';

const AppContent = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    dispatch(loadUsersFromStorage());
  }, [dispatch]);

  return (
    <View style={{ flex: 1 }}>
      {isLoggedIn ? <FloatingActionButton /> : <LoginScreen />}
    </View>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
      <Toast />
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => App);

export default App;
