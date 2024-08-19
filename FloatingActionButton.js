import React, { useState } from 'react';
import {
  View,
  Modal,
  Button,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import ImageCropPicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import { addImage, saveImagesToStorage } from '../redux/imageSlice'; 

const FloatingActionButton = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [columnCount, setColumnCount] = useState(2);
  const [pendingColumnCount, setPendingColumnCount] = useState(2);
  const dispatch = useDispatch();
  const images = useSelector((state) => state.images.byDate);

  const handlePickImage = () => {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      cropping: true, 
    })
      .then((asset) => {
        if (asset.path) {
          const selectedDate = new Date().toLocaleDateString(); 
          dispatch(addImage({ uri: asset.path, date: selectedDate })); 
  
          saveImagesToStorage({
            ...images,
            [selectedDate]: [...(images[selectedDate] || []), asset.path],
          });
          setImagePreview(asset.path); 
        }
      })
      .catch((error) => {
        console.error('Error picking image:', error);
      });
    setModalVisible(false);
  };
  
  const handlePickVideo = () => {
    ImageCropPicker.openPicker({
      mediaType: 'video',
    })
      .then((asset) => {
        if (asset.path) { 
          const selectedDate = new Date().toLocaleDateString(); 
          dispatch(addImage({ uri: asset.path, date: selectedDate })); 
          saveImagesToStorage({
            ...images,
            [selectedDate]: [...(images[selectedDate] || []), asset.path],
          });
          setVideoPreview(asset.path); 
        }
      })
      .catch((error) => {
        console.error('Error picking video:', error);
      });
    setModalVisible(false);
  };
  
  const handleCamera = () => {
    ImageCropPicker.openCamera({
      mediaType: 'photo',
      cropping: true, 
    })
      .then((asset) => {
        if (asset.path) { 
          const selectedDate = new Date().toLocaleDateString(); 
          dispatch(addImage({ uri: asset.path, date: selectedDate }));
          saveImagesToStorage({
            ...images,
            [selectedDate]: [...(images[selectedDate] || []), asset.path],
          });
          setImagePreview(asset.path); 
        }
      })
      .catch((error) => {
        console.error('Error taking photo:', error);
      });
    setModalVisible(false);
  };
  
  const handleRecordVideo = () => {
    ImageCropPicker.openCamera({
      mediaType: 'video',
    })
      .then((asset) => {
        if (asset.path) { 
          const selectedDate = new Date().toLocaleDateString(); 
          dispatch(addImage({ uri: asset.path, date: selectedDate }));
          saveImagesToStorage({
            ...images,
            [selectedDate]: [...(images[selectedDate] || []), asset.path],
          });
          setVideoPreview(asset.path); 
        }
      })
      .catch((error) => {
        console.error('Error recording video:', error);
      });
    setModalVisible(false);
  };
  
  const renderItem = ({ item }) => {
    const isVideo = item.uri.endsWith('.mp4');
    return (
      <TouchableOpacity
        onPress={() => {
          if (isVideo) {
            setVideoPreview(item.uri);
          } else {
            setImagePreview(item.uri); 
          }
        }}
        style={{
          width: `${100 / columnCount}%`,
          alignItems: 'center',
          marginBottom: 10,
          height: 100,
        }}
      >
        {isVideo ? (
          <View style={styles.media}>
            <Video
              source={{ uri: item.uri }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
              paused={true}
            />
            <Icon
              name="play-circle"
              size={50}
              color="#fff"
              style={styles.playIcon}
            />
          </View>
        ) : (
          <Image source={{ uri: item.uri }} style={styles.media} />
        )}
      </TouchableOpacity>
    );
  };

  const getImagesByDate = () => {
    const todayDateString = new Date().toLocaleDateString();

    console.log('Images in Redux store:', images); 

    const sortedDates = Object.keys(images).sort((a, b) => {
      const [dayA, monthA, yearA] = a.split('/').map(Number);
      const [dayB, monthB, yearB] = b.split('/').map(Number);

      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);

      return dateB - dateA;
    });

    const imageGroups = sortedDates.map((date) => {
      if (images[date] && images[date].length > 0) {
        const isToday = date === todayDateString;

        if (isToday) {
          return {
            date: 'Today',
            data: images[date].map((uri) => ({ uri, date })),
          };
        }

        return {
          date,
          data: images[date].map((uri) => ({ uri, date })),
        };
      }
      return null;
    });

    const filteredGroups = imageGroups.filter((group) => group !== null);

    return filteredGroups.sort((a, b) => {
      const dateA = new Date(a.date === 'Today' ? todayDateString : a.date);
      const dateB = new Date(b.date === 'Today' ? todayDateString : b.date);
      return dateB - dateA;
    });
  };

  const handleCropImage = () => {
    if (imagePreview) {
      ImageCropPicker.openCropper({
        path: imagePreview,
        cropping: true,
      })
        .then((asset) => {
          if (asset.uri) {
            const selectedDate = new Date().toLocaleDateString();
            dispatch(addImage({ uri: asset.uri, date: selectedDate }));
            saveImagesToStorage({
              ...images,
              [selectedDate]: [...(images[selectedDate] || []), asset.uri],
            });
            setImagePreview(asset.uri); 
          }
        })
        .catch((error) => {
          console.error('Error cropping image:', error);
        });
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Gallery</Text>
        <TouchableOpacity onPress={() => setSettingsModalVisible(true)}>
          <Text style={styles.dots}>⋮</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={getImagesByDate()}
        renderItem={({ item }) => (
          <>
            <View style={styles.dateContainer}>
              <Text style={styles.displayDate}>{item.date}</Text>
            </View>
            <FlatList
              data={item.data}
              renderItem={renderItem}
              keyExtractor={(item) => item.uri}
              numColumns={columnCount}
              key={`columnCount-${columnCount}`}
              style={styles.flatList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </>
        )}
        keyExtractor={(item) => item.date}
        style={styles.flatList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Action Modal */}
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Button title="Pick Image" onPress={handlePickImage} />
            <Button title="Pick Video" onPress={handlePickVideo} />
            <Button title="Take Photo" onPress={handleCamera} />
            <Button title="Record Video" onPress={handleRecordVideo} />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal
        transparent={true}
        visible={settingsModalVisible}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Choose Columns</Text>
            <View style={styles.columnSelector}>
              <TouchableOpacity onPress={() => setPendingColumnCount(prevCount => Math.max(1, prevCount - 1))}>
                <Text style={styles.columnButton}>-</Text>
              </TouchableOpacity>
              <Text style={styles.columnCount}>{pendingColumnCount}</Text>
              <TouchableOpacity onPress={() => setPendingColumnCount(prevCount => prevCount + 1)}>
                <Text style={styles.columnButton}>+</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalButtons}>
              <Button title="Submit" onPress={() => {
                setColumnCount(pendingColumnCount);
                setSettingsModalVisible(false);
              }} />
              <Button
                title="Close"
                onPress={() => setSettingsModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Image/Video Preview Modal */}
      <Modal
        transparent={true}
        visible={!!imagePreview || !!videoPreview}
        animationType="slide"
      >
        <View style={styles.previewContainer}>
          <View style={styles.previewContent}>
            {imagePreview && (
              <>
                <Image source={{ uri: imagePreview }} style={styles.previewImage} />
                <Button title="Crop Image" onPress={handleCropImage} />
              </>
            )}
            {videoPreview && (
              <Video
                source={{ uri: videoPreview }}
                style={styles.previewImage}
                resizeMode="cover"
                controls={true}
              />
            )}
            <Button
              title="Close"
              onPress={() => {
                setImagePreview(null);
                setVideoPreview(null);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dots: {
    fontSize: 24,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    backgroundColor: '#6200ee',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  columnSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  columnButton: {
    fontSize: 30,
    color: '#6200ee',
    marginHorizontal: 20,
  },
  columnCount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  previewContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  media: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  dateContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  displayDate: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  flatList: {
    width: '100%',
  },
});

export default FloatingActionButton;