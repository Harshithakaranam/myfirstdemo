
import React from 'react';
import { AppRegistry } from 'react-native'; 
import { Provider } from 'react-redux'; 
import store from './redux/store'; 
import FloatingActionButton from './components/FloatingActionButton'; 
import { name as appName } from './app.json'; 

const App = () => {
  return (
    <Provider store={store}>
      <FloatingActionButton />
    </Provider>
  );
};

// Register the app component
AppRegistry.registerComponent(appName, () => App);

export default App;