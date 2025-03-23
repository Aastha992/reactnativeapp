import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const SuccessPopupMileage = ({ isVisible, onConfirm }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onConfirm}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <FontAwesome name="check-circle" size={50} color="#00cc66" style={styles.modalIcon} />
          <Text style={styles.modalText}>Ride cancelled successfully</Text>
          <TouchableOpacity style={styles.okButton} onPress={onConfirm}>
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SuccessPopupMileage;

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
  okButton: {
    backgroundColor: '#486ECD',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '50%',
  },
  okButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
