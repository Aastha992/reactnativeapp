import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    ScrollView,
    Alert,
    ActivityIndicator,
    Modal
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as ImageManipulator from "expo-image-manipulator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as FileSystem from 'expo-file-system';

const PHOTO_DATA_KEY = "photoData";
const USER_TOKEN_KEY = "userToken";
const USER_ID_KEY = "userId";
const BASE_URL = "http://10.0.0.221:5001/api/photos";

const PhotosF = ({ navigation }) => {
    const [photos, setPhotos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(null);
    const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const [selectedPhotos, setSelectedPhotos] = useState([]);

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        setIsLoading(true);
        try {
            const savedUserId = await AsyncStorage.getItem(USER_ID_KEY)
            setUserId(savedUserId)
            const savedData = await getData(PHOTO_DATA_KEY);
            if (savedData) {
                setPhotos(savedData);
            }
            if (savedUserId) {
                fetchPhotos(savedUserId);
            }
        } catch (error) {
            console.log("Error fetching initial data : ", error)
            Alert.alert("Error while loading Initial data, please try again later.")
        } finally {
            setIsLoading(false);
        }
    };

    const saveData = async (key, value) => {
        try {
            const jsonValue = JSON.stringify(value)
            console.log("saving local storage with:", jsonValue)
            await AsyncStorage.setItem(key, jsonValue)
        } catch (e) {
            console.log("error storing data:", e)
        }
    };
    const getData = async (key) => {
        try {
            const jsonValue = await AsyncStorage.getItem(key)
            const savedData = jsonValue != null ? JSON.parse(jsonValue) : null;
            console.log("Loaded photos from local storage:", savedData);
            return savedData
        } catch (e) {
            console.log("Error getting data:", e)
        }
    };
    const fetchPhotos = async (userId) => {
        try {
            const token = await getToken();
            if (!token) {
                Alert.alert("Failed to authenticate user, please login again.");
                return;
            }

            const response = await axios.get(`${BASE_URL}/photo-files/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.status === "success") {
                const cachedPhotos = response.data.data.map((item) => {
                    const correctedImagePath = `http://10.0.0.221:5001/${item.photo.replace(/\\/g, "/")}`;
                    return { ...item, images: [{ uri: correctedImagePath }] };
                });
                 console.log("Cached photos from fetchPhotos:", cachedPhotos);
                setPhotos(cachedPhotos);
                saveData(PHOTO_DATA_KEY, cachedPhotos);
            } else {
                Alert.alert("Error loading data from server, please try again later.");
                console.log("Error response:", response);
            }
        } catch (error) {
            if (error.response) {
                console.log("Error fetching photos (Server Response):", error.response.data);
            } else {
                console.log("Error fetching photos (General):", error.message);
            }
            Alert.alert("Failed to fetch images from server, please try again later.");
        }
    };


    const getToken = async () => {
        try {
            const token = await AsyncStorage.getItem(USER_TOKEN_KEY)
            return token
        } catch (error) {
            console.log("Error while fetching token:", error)
            return null
        }
    };
    // Function to handle taking a picture
    const handleTakePicture = async () => {
        // Request camera permissions
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        if (!cameraPermission.granted) {
            Alert.alert(
                "Permission Denied",
                "Camera permissions are required to take a photo."
            );
            return;
        }
        // Launch camera
        const result = await ImagePicker.launchCameraAsync();
        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            console.log("Captured Image URI:", uri);
            // Extract EXIF data
            const exifData = await extractExifData(uri);
            const location = exifData.location || await getLocation();
            const formattedDate = exifData.date
            const formattedTime = exifData.time
            // Upload image and get the URL
            uploadImage(uri, formattedDate, location, formattedTime);
        }
    };
    // Function to handle picking a picture from gallery
    const handlePickImage = async () => {
        const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!galleryPermission.granted) {
            Alert.alert(
                "Permission Denied",
                "Gallery permissions are required to select a photo."
            );
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            console.log("Selected Image URI:", uri);
            // Extract EXIF data
            const exifData = await extractExifData(uri);
            const location = exifData.location || await getLocation();
            const formattedDate = exifData.date
            const formattedTime = exifData.time
            // Upload image and get the URL
            uploadImage(uri, formattedDate, location, formattedTime)

        }
    };
    const extractExifData = async (imageUri) => {
        try {
            const manipResult = await ImageManipulator.manipulateAsync(
                imageUri,
                [],
                {
                    base64: false,
                    exif: true,
                }
            );
            console.log("Image Manipulation Result:", manipResult);
            if (manipResult.exif) {
                const exif = manipResult.exif
                let location = null
                let date = null;
                let time = null
                //extract the location if present in exif data
                if (exif.GPSLongitude && exif.GPSLatitude) {
                    location = { latitude: exif.GPSLatitude, longitude: exif.GPSLongitude }
                    const address = await Location.reverseGeocodeAsync(location);
                    location = address[0]?.city || "Unknown Location";
                }
                //extract the date and time if present in exif data
                if (exif.DateTimeOriginal) {
                    let exifDateTime = new Date(exif.DateTimeOriginal)
                    date = exifDateTime.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                    });
                    time = exifDateTime.toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                    });
                }
                return { location: location, date: date, time: time }
            } else {
                return { location: null, date: null, time: null }
            }
        } catch (error) {
            console.error("Error extracting EXIF data:", error);
            return { location: null, date: null, time: null }
        }
    };
    const getLocation = async () => {
        try {
            // Request location permissions
            const locationPermission =
                await Location.requestForegroundPermissionsAsync();
            if (!locationPermission.granted) {
                Alert.alert(
                    "Permission Denied",
                    "Location permissions are required to add location data."
                );
                return "Unknown Location"
            }
            // Fetch location
            const location = await Location.getCurrentPositionAsync({});
            const address = await Location.reverseGeocodeAsync(location.coords);
            const locationName = address[0]?.city || "Unknown Location";
            return locationName
        } catch (error) {
            console.error("Error fetching location:", error);
            return "Unknown Location";
        }
    };
    const uploadImage = async (uri, formattedDate, location, formattedTime) => {
        setUploadModalVisible(true);

        try {
            const token = await getToken()
            if (!token) {
                Alert.alert("Failed to authenticate user, please login again.");
                return;
            }
            const uploadData = new FormData();
            uploadData.append("photo", {
                uri: uri,
                name: "image.jpg",
                type: "image/jpeg",
            });

            const response = await axios.post(
                `${BASE_URL}/upload-photo`,
                uploadData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(progress);
                    },
                }
            );
            console.log("Upload response:", response.data);
            if (response.data.status === 'success') {
                const imageUrl = response.data.data.imagePath;
                const cachedImagePath = await uploadAndCacheImage(imageUrl)
                savePhotoData(cachedImagePath, formattedDate, location, formattedTime, token);
                console.log('Upload successful:', response.data.message);
                Alert.alert("Image uploaded successfully.");
            } else {
                console.log('Upload Failed:', response.data.message)
                Alert.alert("Failed to upload image. Try again later.");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            Alert.alert(
                "Upload Failed",
                "Failed to upload Image. Try Again Later."
            );
        } finally {
            setUploadProgress(null);
            setUploadModalVisible(false);
        }
    };
    const uploadAndCacheImage = async (imageUrl) => {
        try {
            const correctedImageUrl = `http://10.0.0.221:5001/${imageUrl.replace(/\\/g, "/")}`;
            console.log("Corrected Image URL:", correctedImageUrl);

            const imageName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
            const cachedImagePath = `${FileSystem.cacheDirectory}${imageName}`;

            const image = await FileSystem.downloadAsync(correctedImageUrl, cachedImagePath);
            if (image.status === 200) {
                console.log("Image cached successfully:", cachedImagePath);
                return cachedImagePath;
            } else {
                console.error("Failed to cache image:", correctedImageUrl);
                return correctedImageUrl; // Fallback to URL
            }
        } catch (error) {
            console.error("Error caching image:", error);
            return imageUrl; // Fallback to original URL
        }
    };

    const savePhotoData = async (imageUrl, formattedDate, location, formattedTime, token) => {
        setIsLoading(true);
        try {
            if (!userId) {
                Alert.alert("User ID is not present.");
                return;
            }

            // Provide fallback values if any field is null
            const date = formattedDate || new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            });
            const time = formattedTime || new Date().toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
            });
            const loc = location || "Unknown Location";

            const payload = {
                userId: userId,
                photo: imageUrl,
                location: loc,
                date: date,
                time: time,
            };

            console.log("Payload for /photo-files:", payload);

            const response = await axios.post(`${BASE_URL}/photo-files`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Response from /photo-files:", response);

            if (response.data.status === "success") {
                console.log("Photo data saved to backend:", response.data.message);
                fetchPhotos(userId); // Fetch all photos from server
                Alert.alert("Photo data saved successfully.");
            } else {
                console.error("Failed to save Photo Data:", response);
                Alert.alert("Failed to save photo data. Please try again later.");
            }
        } catch (error) {
            if (error.response) {
                console.error("Error from server during savePhotoData:", error.response.data);
            } else {
                console.error("Error while saving PhotoData:", error.message);
            }
            Alert.alert("Failed to save photo data. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const deletePhoto = async (photoId) => {
        setIsLoading(true);
        try {
            const token = await getToken()
            if (!token) {
                Alert.alert("Failed to authenticate user, please login again.");
                return;
            }
            const response = await axios.delete(
                `${BASE_URL}/photo-files/${photoId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            if (response.data.status === "success") {
                console.log("Image deleted successfully");
                Alert.alert("Photo deleted successfully.");
                fetchPhotos(userId)
            } else {
                Alert.alert("Failed to delete the photo, try again later.");
                console.log("Failed to delete image response:", response)
            }
        } catch (error) {
            console.error("Error deleting image:", error);
            Alert.alert("Failed to delete the photo, try again later.");
        } finally {
            setIsLoading(false);
        }
    };
    const handleBulkDelete = async () => {
        if (selectedPhotos.length === 0) {
            Alert.alert("No images selected", "Please select images to delete.");
            return;
        }
        setIsLoading(true);
        try {
            const token = await getToken()
            if (!token) {
                Alert.alert("Failed to authenticate user, please login again.");
                return;
            }
            const deletePromises = selectedPhotos.map(photoId =>
                axios.delete(
                    `${BASE_URL}/photo-files/${photoId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                )
            );
            const response = await Promise.all(deletePromises);
            const allSuccess = response.every((res) => res.data.status === "success");
            if (allSuccess) {
                Alert.alert("Photos deleted successfully.");
                fetchPhotos(userId);
                setSelectedPhotos([]);
            } else {
                Alert.alert("Failed to delete all images. Please try again.");
                console.log("Failed to delete images response:", response)
            }
        } catch (error) {
            console.error("Error deleting images:", error);
            Alert.alert("Failed to delete images, try again later.");
        } finally {
            setIsLoading(false);
        }
    };
    const handleImageSelect = (imageId) => {
        const isSelected = selectedPhotos.includes(imageId)
        if (isSelected) {
            setSelectedPhotos(selectedPhotos.filter((id) => id !== imageId))
        } else {
            setSelectedPhotos([...selectedPhotos, imageId])
        }
    };
    const cacheImage = async (imageUrl) => {
        try {
            const correctedImageUrl = `http://10.0.0.221:5001/${imageUrl.replace(/\\/g, '/')}`;
            console.log("Corrected Image URL for caching:", correctedImageUrl);
            const imageName = correctedImageUrl.substring(correctedImageUrl.lastIndexOf("/") + 1);
            const cachedImagePath = `${FileSystem.cacheDirectory}${imageName}`;

            const image = await FileSystem.downloadAsync(correctedImageUrl, cachedImagePath);
            if (image.status === 200) {
                console.log("Image cached successfully:", cachedImagePath);
                return cachedImagePath;
            } else {
                console.log("Failed to cache image:", correctedImageUrl);
                return correctedImageUrl;
            }
        } catch (error) {
            console.error("Error caching image:", error);
            return imageUrl;
        }
    };


    // Render photo group
    const renderPhotoGroup = ({ item }) => (
        <View style={styles.photoSection}>
            <View style={styles.photoHeader}>
                <Text style={styles.photoDate}>{item.date}</Text>
                <Text style={styles.photoTime}>{item.time}</Text>
                <TouchableOpacity onPress={() => deletePhoto(item._id)}>
                    <Ionicons name="trash" size={20} color="red" />
                </TouchableOpacity>
            </View>
            <Text style={styles.photoLocation}>{item.location}</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.photoGrid}>
                {item.images.map((image, index) => (
                     <TouchableOpacity
                        key={index}
                        onPress={() => handleImageSelect(item._id)}
                    >
                        <View style={styles.imageContainer}>
                        <Image
    source={{ uri: image.uri }}
    style={styles.photo}
    onError={(e) => console.log("Error loading image:", image.uri, e.nativeEvent.error)}
/>



                            {selectedPhotos.includes(item._id) && (
                                <View style={styles.selectionOverlay} />
                            )}
                        </View>
                    </TouchableOpacity>
                ))}

            </ScrollView>
        </View>
    );
    const renderEmptyList = () => {
        return (
            <View style={styles.emptyListContainer}>
                <Text style={styles.emptyListText}>No photos yet. Take a picture or select one from gallery.</Text>
            </View>
        );
    };
    console.log("Photos before FlatList:", photos)
    return (
        <View style={styles.container}>
            <Modal visible={uploadModalVisible} transparent={true} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ActivityIndicator size="large" color="#486ECD" />
                        {uploadProgress !== null && (
                            <Text style={styles.uploadProgressText}>Uploading {uploadProgress}%</Text>
                        )}
                    </View>
                </View>
            </Modal>
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}

            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Photo Files</Text>
                {selectedPhotos.length > 0 && (
                    <TouchableOpacity onPress={handleBulkDelete} style={styles.bulkDeleteButton}>
                        <Ionicons name="trash" size={24} color="red" />
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={styles.takePictureButton}
                    onPress={handleTakePicture}>
                    <Ionicons name="camera" size={20} color="#486ECD" />
                    <Text style={styles.takePictureText}> Take Pictures</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.galleryButton}
                    onPress={handlePickImage}>
                    <Ionicons name="images" size={20} color="#486ECD" />
                    <Text style={styles.galleryText}> Choose from Gallery</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={photos}
                keyExtractor={(item) => item._id || item.id}
                renderItem={renderPhotoGroup}
                ListEmptyComponent={renderEmptyList}
                contentContainerStyle={styles.photoList}
            />

        </View>
    );
};
export default PhotosF;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        paddingHorizontal: 16,
        paddingTop: 60,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 8,
        color: "#000",
    },
    actionButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    takePictureButton: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#486ECD",
        padding: 8,
        borderRadius: 5,
    },
    takePictureText: {
        fontSize: 16,
        color: "#486ECD",
        marginLeft: 8,
    },
    galleryButton: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#486ECD",
        padding: 8,
        borderRadius: 5,
    },
    galleryText: {
        fontSize: 16,
        color: "#486ECD",
        marginLeft: 8,
    },
    photoList: {
        paddingBottom: 16,
    },
    photoSection: {
        marginBottom: 16,
        backgroundColor: "#f2f4f7",
        padding: 10,
        borderRadius: 8,
    },
    photoHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    photoDate: {
        fontSize: 16,
        fontWeight: "500",
    },
    photoTime: {
        fontSize: 14,
        color: "#6b7280",
        marginLeft: 10,
    },
    photoLocation: {
        fontSize: 14,
        color: "#6b7280",
        marginBottom: 10,
    },
    photoGrid: {
        flexDirection: "row",
    },
    imageContainer: {
        position: 'relative',
        marginRight: 10,
        borderRadius: 5,
    },
    photo: {
        width: 150,
        height: 150,
        borderRadius: 5,
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    text: {
        fontSize: 12,
        color: 'white',
    },
    selectionOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 255, 0.3)',
        borderRadius: 5
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(255,255,255,0.7)",
        justifyContent: "center",
        alignItems: "center"
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    uploadProgressText: {
        fontSize: 16,
        marginTop: 10,
    },
    emptyListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyListText: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
    },
    bulkDeleteButton: {
        padding: 5
    }
});