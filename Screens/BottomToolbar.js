import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Use MaterialIcons for most icons
import { useNavigation } from '@react-navigation/native';

const BottomToolbar = ({ currentRoute }) => {
    const navigation = useNavigation(); // Ensure navigation is available
    

    const getColor = (screenName) =>  currentRoute === screenName ? '#486ECD' : '#808080';
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.navigate('HomeScreen')}
                style={styles.button}>
                <Icon name="home" size={24} color={getColor('HomeScreen')} />
                <Text style={[styles.text, { color: getColor('HomeScreen') }]}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('MileageHistoryScreen')}
                style={styles.button}>
                <Icon name="directions-car" size={24} color={getColor('MileageHistoryScreen')} />
                <Text style={[styles.text, { color: getColor('MileageHistoryScreen') }]}>Mileage</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('Expenses')}
                style={styles.button}>
                <Icon name="attach-money" size={24} color={getColor('Expenses')} />
                <Text style={[styles.text, { color: getColor('Expenses') }]}>Expenses</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('Daily72')}
                style={styles.button}>
                <Icon name="insert-chart" size={24} color={getColor('Daily72')} />
                <Text style={[styles.text, { color: getColor('Daily72') }]}>Reports</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('Invoicing')}
                style={styles.button}>
                <Icon name="description" size={24} color={getColor('Invoicing')} />
                <Text style={[styles.text, { color: getColor('Invoicing') }]}>Invoicing</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        height: 80,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        position: 'absolute',
        bottom: 0, // Move 10 pixels above the bottom edge
        left: 0,
        right: 0,
        width: '100%',
    },
    button: {
        alignItems: 'center',
    },
    text: {
        fontSize: 12,
        color: '#808080',
        marginTop: 4, // Space between icon and text
    },
});

export default BottomToolbar;
