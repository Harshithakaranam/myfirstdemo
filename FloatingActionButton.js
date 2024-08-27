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
  Dimensions
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ImageCropPicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import { addImage, saveImagesToStorage } from '../redux/imageSlice'; 
import { logout } from '../redux/authSlice';

const FloatingActionButton = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [columnCount, setColumnCount] = useState(2);
  const [pendingColumnCount, setPendingColumnCount] = useState(2);
  const dispatch = useDispatch();
  const images = useSelector((state) => state.images.byDate);

  const handleLogout = () => {
    dispatch(logout());
  };

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

  const screenWidth = Dimensions.get('window').width;
  const itemPadding = 5; // Adjust this value to increase or decrease padding
  
  const renderItem = ({ item }) => {
    const isVideo = item.uri.endsWith('.mp4');
  
    return (
      <TouchableOpacity
        onPress={() => {
          console.log('Item pressed:', item.uri); // Debugging log
          if (isVideo) {
            setVideoPreview(item.uri);
          } else {
            setImagePreview(item.uri);
          }
        }}
        style={{
          flex: 1 / columnCount, // Distribute items evenly based on the column count
          margin: itemPadding, // Add margin around items
          height: screenWidth / columnCount - 2 * itemPadding, // Keep height proportional to width
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
    const todayDate = new Date();
    const yesterdayDate = new Date(todayDate);
    yesterdayDate.setDate(todayDate.getDate() - 1);
  
    const todayDateString = todayDate.toLocaleDateString();
    const yesterdayDateString = yesterdayDate.toLocaleDateString();
  
    const sortedDates = Object.keys(images).sort((a, b) => {
      const [dayA, monthA, yearA] = a.split('/').map(Number);
      const [dayB, monthB, yearB] = b.split('/').map(Number);
  
      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);
  
      return dateB - dateA;
    });
  
    const imageGroups = sortedDates.map((date) => {
      if (images[date] && images[date].length > 0) {
        let displayDate = date;
  
        if (date === todayDateString) {
          displayDate = 'Today';
        } else if (date === yesterdayDateString) {
          displayDate = 'Yesterday';
        }
  
        return {
          date: displayDate,
          data: images[date].map((uri) => ({ uri, date: displayDate })),
        };
      }
      return null;
    });
  
    const filteredGroups = imageGroups.filter((group) => group !== null);
  
    return filteredGroups.sort((a, b) => {
      const dateA = new Date(a.date === 'Today' ? todayDateString : (a.date === 'Yesterday' ? yesterdayDateString : a.date));
      const dateB = new Date(b.date === 'Today' ? todayDateString : (b.date === 'Yesterday' ? yesterdayDateString : b.date));
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
          setImagePreview(item.uri); // Ensure this line is executed

        });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Header content if any */}
      </View>

      <View style={styles.mediaHeaderContainer}>
        <Text style={styles.mediaHeading}>Gallery</Text>
        <TouchableOpacity onPress={() => setSettingsModalVisible(true)}>
          <Icon name="settings-outline" size={24} color="#fff" />
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

      {/* Modal for Image/Video Picking */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={handlePickImage}
          >
            <Text style={styles.modalButtonText}>Pick Image</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={handlePickVideo}
          >
            <Text style={styles.modalButtonText}>Pick Video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={handleCamera}>
            <Text style={styles.modalButtonText}>Open Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={handleRecordVideo}
          >
            <Text style={styles.modalButtonText}>Record Video</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.closeButton]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={settingsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Settings</Text>
            {/* Add your settings options here */}
            <View style={styles.settingsContainer}>
              <Text style={styles.modalOption}>Columns:</Text>
              <View style={styles.columnAdjust}>
                <TouchableOpacity
                  style={styles.columnButton}
                  onPress={() => setPendingColumnCount(Math.max(1, pendingColumnCount - 1))}
                >
                  <Text style={styles.columnButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.columnCount}>{pendingColumnCount}</Text>
                <TouchableOpacity
                  style={styles.columnButton}
                  onPress={() => setPendingColumnCount(pendingColumnCount + 1)}
                >
                  <Text style={styles.columnButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setColumnCount(pendingColumnCount);
                    setSettingsModalVisible(false);
                  }}
                >
                  <Text style={styles.modalButtonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.closeButton]}
                  onPress={() => setSettingsModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
              </View>

              {/* Add Logout Button */}
              <TouchableOpacity
                style={[styles.modalButton, styles.logoutButton]}
                onPress={handleLogout}
              >
                <Text style={styles.modalButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

  {/* Image Preview Modal */}
  <Modal
        transparent={true}
        visible={!!imagePreview}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.previewModalContent}>
            <Image source={{ uri: imagePreview }} style={styles.fullImage} />
            <Button title="Crop" onPress={handleCropImage} />
            <Button title="Close" onPress={() => setImagePreview(null)} />
          </View>
        </View>
      </Modal>

      {/* Video Preview Modal */}
      <Modal
        transparent={true}
        visible={!!videoPreview}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.previewModalContent}>
            <Video
              source={{ uri: videoPreview }}
              style={styles.fullImage}
              controls={true}
              resizeMode="contain"
            />
            <Button title="Close" onPress={() => setVideoPreview(null)} />
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
    paddingTop: 50, 
  },
  mediaHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,  

    backgroundColor: 'blue',

  },
  mediaHeading: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dateContainer: {
    marginTop: 15,
    marginBottom: 5,
    paddingLeft: 10,
  },
  displayDate: {
    color: 'grey',
    fontSize: 16,
    fontWeight: 'bold',

  },
  flatList: {
    flex: 1,
  },
  media: {
    flex: 1,
    height: '100%',
    borderRadius: 10,
  },
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#6200EE',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    color: '#fff',
    fontSize: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  modalButton: {
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
      width: '80%',
    alignItems: 'center',
  },
  
  closeButton: {
    color: 'black',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  modalHeading: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  settingsContainer: {
    alignItems: 'center',
  },
  modalOption: {
    color: 'black',
    fontSize: 18,
    marginBottom: 10,
  },
  columnAdjust: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  columnButton: {
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 5,
  },
  columnButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  columnCount: {
    color: 'black',
    fontSize: 18,
    marginHorizontal: 20,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  logoutButton: {
    marginTop: 20,
    color: 'black',

  },
  ppreviewModalContent: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  fullImage: {
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').height / 2,
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default FloatingActionButton;
