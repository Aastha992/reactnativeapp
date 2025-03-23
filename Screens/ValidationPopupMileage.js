import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const ValidationPopupMileage = ({ isVisible, navigation }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => navigation.navigate('MileageCancelScreen')}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <FontAwesome name="times-circle" size={50} color="#ff4d4d" style={styles.modalIcon} />
          <Text style={styles.modalText}>Are you sure you want to cancel the ride?</Text>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity style={styles.noButton} onPress={() => navigation.navigate('MileageCancelScreen')}>
              <Text style={styles.noButtonText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.yesButton} onPress={() => navigation.navigate('SuccessPopupMileage')}>
              <Text style={styles.yesButtonText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ValidationPopupMileage;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  noButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#486ECD',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 10,
  },
  noButtonText: {
    color: '#486ECD',
    fontSize: 16,
  },
  yesButton: {
    flex: 1,
    backgroundColor: '#486ECD',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  yesButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
