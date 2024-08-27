import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IMAGE_STORAGE_KEY = '@images';

const imageSlice = createSlice({
  name: 'images',
  initialState: {
    byDate: {},
  },
  reducers: {
    addImage: (state, action) => {
      const { uri, date } = action.payload;
      if (!state.byDate[date]) {
        state.byDate[date] = [];
      }
      state.byDate[date].push(uri);
    },
    loadImages: (state, action) => {
      state.byDate = action.payload;
    },
    clearImages: (state) => {
      return { byDate: {} };
    },
  },
});



// AsyncStorage functions
export const saveImagesToStorage = async (images) => {
  try {
    const jsonValue = JSON.stringify(images);
    await AsyncStorage.setItem(IMAGE_STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save images:', e);
  }
};

export const loadImagesFromStorage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(IMAGE_STORAGE_KEY);
    return jsonValue ? JSON.parse(jsonValue) : {}; 
  } catch (e) {
    console.error('Failed to load images:', e);
    return {}; 
  }
};

export const { addImage, loadImages, clearImages } = imageSlice.actions;
export default imageSlice.reducer;

