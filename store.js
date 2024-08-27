import { configureStore } from '@reduxjs/toolkit';
import imageReducer, { loadImagesFromStorage, loadImages } from './imageSlice';
import authReducer, { loadUsersFromStorage } from './authSlice';

const store = configureStore({
  reducer: {
    images: imageReducer,
    auth: authReducer,
  },
});

const loadInitialData = async () => {
  try {
    const images = await loadImagesFromStorage();
    store.dispatch(loadImages(images));
    await store.dispatch(loadUsersFromStorage());
  } catch (error) {
    console.error('Failed to load initial data:', error);
  }
};

loadInitialData();

export default store;
