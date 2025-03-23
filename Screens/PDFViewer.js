import React from 'react';
import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

const PDFViewer = ({ route, navigation }) => {
    const { pdfUrl } = route.params;

    return (
        <View style={{ flex: 1 }}>
            {/* Back Button */}
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                    position: 'absolute',
                    top: 40,
                    left: 10,
                    zIndex: 1,
                    backgroundColor: 'white',
                    borderRadius: 20,
                    padding: 10,
                    elevation: 5, // Adds shadow for Android
                    shadowColor: "#000", // Adds shadow for iOS
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                }}
            >
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            {/* WebView for PDF */}
            <WebView
                source={{ uri: pdfUrl }}
                startInLoadingState={true}
                renderLoading={() => <ActivityIndicator size="large" color="#0000ff" />}
            />
        </View>
    );
};

export default PDFViewer;
