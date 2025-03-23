import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

const UploadSchedule = ({ navigation }) => {
    const [projectName, setProjectName] = useState('');
    const [projectNumber, setProjectNumber] = useState('');
    const [owner, setOwner] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');

    const handleBackButton = () => {
        navigation.goBack();
    };

    const pickDocument = async () => {
        try {
            const res = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
            if (res.assets && res.assets.length > 0) {
                setFile(res.assets[0]);
                setUploadStatus('');
            } else {
                setFile(null);
                setUploadStatus('Error Picking the Document');
            }
        } catch (err) {
            console.error('Error picking document:', err);
            setUploadStatus('Error Picking the Document');
        }
    };

    const uploadSchedule = async () => {
        if (!file) {
            setUploadStatus('Please select a PDF file');
            return;
        }
        if (!projectName.trim()) {
            setUploadStatus('Please provide the Project Name');
            return;
        }
        if (!projectNumber.trim()) {
            setUploadStatus('Please provide the Project Number');
            return;
        }
        if (!owner.trim()) {
            setUploadStatus('Please provide the Owner');
            return;
        }

        setUploading(true);
        setUploadStatus('Uploading...');

        const formData = new FormData();
        formData.append("schedule", {
            uri: file.uri,
            type: "application/pdf",
            name: file.name || "uploaded-file.pdf",
        });

        formData.append('projectName', projectName);
        formData.append('projectNumber', projectNumber);
        formData.append('owner', owner);
        formData.append('month', new Date().toISOString().slice(0, 7)); 

        console.log("Form Data Before Upload:", [...formData.entries()]);

        try {
            const response = await axios.post(
                "http://10.0.0.221:5001/api/schedules/upload",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            console.log('Upload response:', response.data);
            Alert.alert('Success', 'Schedule uploaded successfully');
            setUploadStatus('Upload successful!');
            setProjectName('');
            setProjectNumber('');
            setOwner('');
            setFile(null);
        } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus('Upload failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={handleBackButton}>
                    <Ionicons name="arrow-back" size={24} color="#000000" />
                </TouchableOpacity>
                <Text style={styles.header}>Upload Schedule</Text>
            </View>

            {/* Project Name Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Project Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Project Name"
                    value={projectName}
                    onChangeText={setProjectName}
                />
            </View>

            {/* Project Number Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Project Number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Project Number"
                    value={projectNumber}
                    onChangeText={setProjectNumber}
                />
            </View>

            {/* Owner Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Owner</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Owner"
                    value={owner}
                    onChangeText={setOwner}
                />
            </View>

            {/* Buttons */}
            <View style={styles.bottomButtonsContainer}>
                <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
                    <Text style={styles.uploadButtonText}>Select PDF File</Text>
                </TouchableOpacity>

                {file && <Text style={styles.selectedFileText}>Selected: {file.name}</Text>}

                <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={uploadSchedule}
                    disabled={uploading}
                >
                    {uploading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.uploadButtonText}>Upload Schedule</Text>
                    )}
                </TouchableOpacity>
                {uploadStatus ? <Text style={styles.statusText}>{uploadStatus}</Text> : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000',
        marginLeft: 5,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        color: '#000',
        marginBottom: 5,
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    uploadButton: {
        backgroundColor: '#486ECD',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    uploadButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    selectedFileText: {
        marginBottom: 20,
        fontSize: 14,
        color: '#666666',
    },
    statusText: {
        marginBottom: 20,
        fontSize: 14,
        color: 'green',
        textAlign: 'center',
    },
    bottomButtonsContainer: {
        justifyContent: 'flex-end',
        paddingBottom: 30,
    },
});

export default UploadSchedule;
