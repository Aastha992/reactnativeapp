import React from 'react';
import { StatusBar, View, StyleSheet, Platform } from 'react-native';

const CustomStatusBar = ({ backgroundColor, barStyle = 'light-content' }) => {
  return (
    <View style={[styles.statusBar, { backgroundColor }]}>
      <StatusBar
        translucent
        backgroundColor={backgroundColor}
        barStyle={barStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 0, // Handles iOS and Android dynamically
  },
});

export default CustomStatusBar;
