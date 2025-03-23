import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

const ProjectDetailsScreen = ({ route, navigation }) => {
  const handleBackButton = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
            <TouchableOpacity onPress={handleBackButton}>
             <Ionicons name="arrow-back" size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.header}>Project Schedule</Text>
          </View>
        <WebView
          source={{ uri: "http://samples.leanpub.com/thereactnativebook-sample.pdf" }}
          style={styles.webview}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, // Add some padding to make room for status bar
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
        paddingHorizontal:16
      },
  webview: {
    flex: 1,
  },
});

export default ProjectDetailsScreen;