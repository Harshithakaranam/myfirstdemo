import { configureStore } from '@reduxjs/toolkit';
import imageReducer, { loadImagesFromStorage, loadImages } from './imageSlice';

const store = configureStore({
  reducer: {
    images: imageReducer,
  },
});

// Load images from AsyncStorage when the app starts
const loadInitialData = async () => {
  try {
    const images = await loadImagesFromStorage();
    store.dispatch(loadImages(images));
  } catch (error) {
    console.error('Failed to load initial data:', error);
  }
};

loadInitialData();

export default store;
