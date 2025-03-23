import React, { useEffect } from 'react';
import { View, ImageBackground, StyleSheet, Text, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('LoginScreen'); // Navigate to LoginScreen after 2 seconds
    }, 2000);

    return () => clearTimeout(timer); // Clear timer if component unmounts
  }, [navigation]);

  return (
    <ImageBackground
      source={require('../Assets/image_1.png')} // Background image 
      style={styles.background}
    >
      <SafeAreaView style={styles.overlay}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../Assets/logo.png')} // Logo image
            style={styles.logo}
          />
          <View style={styles.textContainer}>
            <Text style={styles.companyText}>BRICKX.</Text>
            {/* <Text style={styles.companyText}>COMPANY</Text> */}
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(72, 110, 205, 0.89)', // Light blue overlay with 89% transparent/opacity
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  textContainer: {
    marginLeft: 15,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  companyText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default SplashScreen;
