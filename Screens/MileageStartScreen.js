import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView , useWindowDimensions, Keyboard } from 'react-native';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Polyline } from 'react-native-maps';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import polyline from '@mapbox/polyline';
import debounce from 'lodash.debounce';

const GOOGLE_MAPS_API_KEY = "AIzaSyCf-YwWVRgWLB7DbfhVdAyXS0NbreP3cRA";
const API_BASE_URL = "http://10.0.0.221:5001/api"; 


const MileageStartScreen = ({ navigation }) => {
    const [startLocation, setStartLocation] = useState('');
    const [constructionSites, setConstructionSites] = useState([{ id: 1, location: '' }]);
    const [distanceData, setDistanceData] = useState({
        homeToSite: 0,
        interSites: [],
        siteToHome: 0,
        totalDistance: 0
    });
    const [payableAmount, setPayableAmount] = useState(0);
    const [travelTime, setTravelTime] = useState('');
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [isRideActive, setIsRideActive] = useState(false);
    const [suggestions, setSuggestions] = useState({ home: [], sites: [] });
    const [inputLayouts, setInputLayouts] = useState({ home: null, sites: {} });
    const mapRef = useRef(null);
    const [userToken, setUserToken] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const user_id = await AsyncStorage.getItem('userId');
                if (token && user_id) {
                    setUserToken(token);
                    setUserId(user_id)
                }
            } catch (error) {
                console.error("Failed to fetch token", error);
            }
        };
        fetchToken();
    }, []);


    useEffect(() => {
        setSuggestions(prev => ({ ...prev, sites: constructionSites.map(() => []) }));
    }, [constructionSites]);

    // Debounced suggestion fetcher with cleanup
    const fetchSuggestions = useCallback(debounce(async (input, type, index = 0) => {
        console.log("Fetching suggestions for:", input);
        if (!input || input.length < 3) {
            if (type === 'home') {
                setSuggestions(prev => ({ ...prev, home: [] }));
            } else {
                const newSiteSuggestions = [...suggestions.sites];
                newSiteSuggestions[index] = [];
                setSuggestions(prev => ({ ...prev, sites: newSiteSuggestions }));
            }
            return;
        }

        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
                {
                    params: {
                        input,
                        key: GOOGLE_MAPS_API_KEY,
                        components: "country:ca",
                        sessiontoken: Math.random().toString(36).substring(2, 15),
                       types: 'geocode|establishment'
                    }
                }
            );
            console.log("Suggestions response:", response);
            if (response.data.predictions) {
              console.log("Predictions before state update:", response.data.predictions)
                if (type === 'home') {
                    setSuggestions(prev => ({ ...prev, home: response.data.predictions }));
                } else {
                    const newSiteSuggestions = [...suggestions.sites];
                    newSiteSuggestions[index] = response.data.predictions;
                    setSuggestions(prev => ({ ...prev, sites: newSiteSuggestions }));
                }
            }
        } catch (error) {
            console.log("Suggestions error:", error)
            console.error("Suggestions error:", error);
        }
    }, 300), []);


    useEffect(() => {
        return () => fetchSuggestions.cancel();
    }, [fetchSuggestions]);

    const getRouteData = async (origin, destination) => {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/directions/json`,
                {
                    params: {
                        origin,
                        destination,
                        mode: 'driving',
                        key: GOOGLE_MAPS_API_KEY
                    }
                }
            );

            if (response.data.routes?.[0]?.legs?.[0]) {
                const leg = response.data.routes[0].legs[0];
                return {
                    distance: leg.distance.value / 1000,
                    duration: leg.duration.text,
                    coords: polyline.decode(response.data.routes[0].overview_polyline.points)
                        .map(([lat, lng]) => ({ latitude: lat, longitude: lng }))
                };
            }
            return { distance: 0, duration: '', coords: [] };

        } catch (error) {
            console.error('Routing error:', error);
            return { distance: 0, duration: '', coords: [] };
        }
    };


    const calculateExpenses = () => {
        const { homeToSite, interSites, siteToHome } = distanceData;
        let total = 0;

        total += Math.max(homeToSite - 100, 0) * 0.5;
        total += interSites.reduce((sum, dist) => sum + (dist * 0.5), 0);
        total += Math.max(siteToHome - 100, 0) * 0.5;

        setPayableAmount(total.toFixed(2));
    };
    const handleStartRide = async () => {
        if (!startLocation || constructionSites.some(site => !site.location)) {
            alert('Please fill all location fields');
            return;
        }
        setIsRideActive(true);
        setDistanceData({
            homeToSite: 0,
            interSites: [],
            siteToHome: 0,
            totalDistance: 0
        });
        setPayableAmount(0);
        setRouteCoordinates([]);
        setTravelTime('');

        try {
            let totalDistance = 0;
            let allCoords = [];
            // Home to the first site
            const homeToFirst = await getRouteData(startLocation, constructionSites[0].location);
            if (homeToFirst && homeToFirst.distance) {
                setDistanceData(prev => ({
                    ...prev,
                    homeToSite: homeToFirst.distance,
                }));
                totalDistance += homeToFirst.distance;
                allCoords.push(...homeToFirst.coords);
            }
            const interSiteDistances = [];
            for (let i = 0; i < constructionSites.length - 1; i++) {
                const result = await getRouteData(constructionSites[i].location, constructionSites[i + 1].location);
                if (result && result.distance) {
                    interSiteDistances.push(result.distance);
                    totalDistance += result.distance;
                    allCoords.push(...result.coords)
                }
            }
            setDistanceData(prev => ({ ...prev, interSites: interSiteDistances, totalDistance: totalDistance }));
            setRouteCoordinates(allCoords);
            setDistanceData(prev => ({ ...prev, totalDistance: totalDistance }));
        } catch (error) {
            console.error('Failed to start ride:', error);
            setIsRideActive(false);
        }
    };

    // Ride end handler (Fixed distance calculation)

    const handleEndRide = async () => {
      try {
       const lastSite = constructionSites[constructionSites.length - 1].location;
       const returnTrip = await getRouteData(lastSite, startLocation);
       let newTotal = distanceData.homeToSite +
           distanceData.interSites.reduce((a, b) => a + b, 0);
       if(returnTrip && returnTrip.distance){
           newTotal +=returnTrip.distance;
       }
       setDistanceData(prev => ({
        ...prev,
        siteToHome: returnTrip.distance || 0,
        totalDistance: newTotal || 0 // Ensuring totalDistance is never undefined
    }));
    
       const allCoords = [...routeCoordinates];
       if(returnTrip && returnTrip.coords){
           allCoords.push(...returnTrip.coords)
         }
       setRouteCoordinates(allCoords);
     calculateExpenses();
 
     // Save ride data
     const rideData = {
           userId: userId,
           startLocation,
           constructionSites: constructionSites.map(s => s.location),
           routeCoordinates:allCoords
       };
         const token = await AsyncStorage.getItem('userToken'); // get the token
 
       const response = await axios.post(`${API_BASE_URL}/mileage/calculate-mileage`, rideData,{
             headers: {
               Authorization: `Bearer ${token}`,
             },
         });
          if (response.data) {
             setDistanceData(prev => ({
               ...prev,
                 totalDistance: response.data.totalDistance
             }));
               setPayableAmount(response.data.expenses);
             const existingRides = JSON.parse(await AsyncStorage.getItem('rides') || '[]');
             await AsyncStorage.setItem('rides', JSON.stringify([...existingRides, rideData]));
           }
 
    } catch (error) {
         console.error("Failed to end ride:", error);
    } finally {
         setIsRideActive(false);
     }
   };


    const handleAddSite = () => {
        setConstructionSites(prev => [...prev, { id: prev.length + 1, location: '' }]);
    };

    const handleRemoveSite = (id) => {
        setConstructionSites(prev => prev.filter(site => site.id !== id));
    };

    const handleSiteChange = (id, text, index) => {
      fetchSuggestions.cancel();
      setConstructionSites(prev =>
          prev.map(site =>
              site.id === id ? { ...site, location: text } : site
          )
      );
    //Clear existing suggestions
      const newSiteSuggestions = [...suggestions.sites];
       newSiteSuggestions[index] = [];
     setSuggestions(prev => ({ ...prev, sites: newSiteSuggestions }));
      fetchSuggestions(text, 'site', index);
  };

    useEffect(() => {
        if (routeCoordinates.length > 0 && mapRef.current) {
            mapRef.current.fitToCoordinates(routeCoordinates, {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
            });
        }
    }, [routeCoordinates]);

    const handleInputLayout = (event, type, index) => {
        const { layout } = event.nativeEvent;
        if(type === 'home'){
            setInputLayouts(prev => ({ ...prev, home: layout}));
        } else if (type === 'site') {
            setInputLayouts(prev => {
              const newSitesLayouts = {...prev.sites};
             newSitesLayouts[index] = layout;
              return {
                ...prev,
                  sites: newSitesLayouts
                };
            });
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps='handled'>
            {/* Header */}
            <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('MileageHistoryScreen')}>
   <Ionicons name="arrow-back" size={24} color="#333" />
 </TouchableOpacity>
                <Text style={styles.headerTitle}>Mileage Tracker</Text>
            </View>

            {/* Location Inputs */}
            <View style={styles.inputGroup}>
                {/* Home Address */}
                <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="home-map-marker" size={20} color="#555" />
                    <TextInput
                        style={styles.input}
                        placeholder="Home Address"
                        placeholderTextColor="#999"
                        value={startLocation}
                        onChangeText={text => {
                            setStartLocation(text);
                            fetchSuggestions(text, 'home');
                        }}
                        onLayout={(event) => handleInputLayout(event, 'home')}
                        editable={!isRideActive}
                    />
                </View>

                {suggestions.home.length > 0 && inputLayouts.home && (
                  <View style={{
                    position: 'absolute',
                    top: inputLayouts.home.y + inputLayouts.home.height + 1,
                    left: inputLayouts.home.x,
                    width: inputLayouts.home.width,
                    zIndex: 1000,
                  }}
                  >
                     {suggestions.home.map((suggestion, index) => {
                      console.log("Rendering home suggestion:", suggestion);
                      return (
                        <TouchableOpacity
                            key={index}
                            style={styles.suggestionItem}
                            onPress={() => {
                      setStartLocation(suggestion.description);
                      setSuggestions(prev => ({ ...prev, home: [] })); // Clear home suggestions
                      Keyboard.dismiss()
                      fetchSuggestions.cancel(); // Cancel any pending API calls
                    }}
                            >
                              <Text style={styles.suggestionText}>{suggestion.description}</Text>
                            </TouchableOpacity>
                        )
                       })}
                      </View>
                  )}

                {/* Construction Sites */}
                {constructionSites.map((site, index) => (
                    <View key={site.id} style={styles.siteContainer}>
                        <View style={styles.siteInputWrapper}>
                            <View style={styles.inputContainer}>
                                <MaterialCommunityIcons name="shovel" size={20} color="#555" />
                                <TextInput
                                    style={styles.input}
                                    placeholder={`Construction Site ${index + 1}`}
                                    placeholderTextColor="#999"
                                    value={site.location}
                                    onChangeText={text => handleSiteChange(site.id, text, index)}
                                    onLayout={(event) => handleInputLayout(event, 'site', index)}
                                    editable={!isRideActive}
                                />
                            </View>
                            {suggestions.sites[index]?.length > 0 && inputLayouts.sites[index] && (
                            <View style={{
                                position: 'absolute',
                                top: inputLayouts.sites[index].y + inputLayouts.sites[index].height + 1,
                                left: inputLayouts.sites[index].x,
                                width: inputLayouts.sites[index].width,
                                zIndex: 1000
                            }}
                            >
                                {suggestions.sites[index]?.map((suggestion, sIndex) => {
                                    console.log("Rendering site suggestion:", suggestion)
                                    return (
                                        <TouchableOpacity
                                            key={sIndex}
                                            style={styles.suggestionItem}
                                            onPress={() => {
                                                handleSiteChange(site.id, suggestion.description, index);
                                                setSuggestions(prev => ({
                                                    ...prev,
                                                    sites: prev.sites.map((s, i) => i === index ? [] : s) // Clear specific site's suggestions
                                                }));
                                                 Keyboard.dismiss()
                                                fetchSuggestions.cancel(); // Cancel any pending API calls
                                            }}
                                        >
                                            <Text style={styles.suggestionText}>{suggestion.description}</Text>
                                        </TouchableOpacity>
                                    )
                                }
                                )}
                                </View>
                            )}
                        </View>

                        {index > 0 && (
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => handleRemoveSite(site.id)}
                            >
                                <Ionicons name="remove-circle" size={24} color="#ff4444" />
                            </TouchableOpacity>
                        )}
                    </View>
                ))}

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddSite}
                    disabled={isRideActive}
                >
                    <FontAwesome name="plus" size={16} color="white" />
                    <Text style={styles.addButtonText}>Add Construction Site</Text>
                </TouchableOpacity>
            </View>

            {/* Map Display */}
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: 43.6532,
                    longitude: -79.3832,
                    latitudeDelta: 0.5,
                    longitudeDelta: 0.5,
                }}
            >
                {routeCoordinates.length > 0 && (
                    <Polyline
                        coordinates={routeCoordinates}
                        strokeWidth={4}
                        strokeColor="#2196F3"
                    />
                )}
            </MapView>

            {/* Controls */}
            <View style={styles.controls}>
                <TouchableOpacity
                    style={[styles.button, isRideActive && styles.disabledButton]}
                    onPress={handleStartRide}
                    disabled={isRideActive}
                >
                    <Text style={styles.buttonText}>Start Ride</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, !isRideActive && styles.disabledButton]}
                    onPress={handleEndRide}
                    disabled={!isRideActive}
                >
                    <Text style={styles.buttonText}>End Ride</Text>
                </TouchableOpacity>
            </View>

            {/* Results Display */}
            <View style={styles.resultsContainer}>
                <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Total Distance:</Text>
                    <Text style={styles.resultValue}>
  {(typeof distanceData.totalDistance === 'number' 
    ? distanceData.totalDistance.toFixed(2) 
    : '0.00')} km
</Text>

                </View>

                <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Estimated Time:</Text>
                    <Text style={styles.resultValue}>{travelTime}</Text>
                </View>

                <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Payable Amount:</Text>
                    <Text style={styles.resultValue}>${payableAmount}</Text>
                </View>
            </View>
        </ScrollView>
        
    );
};


const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
 flexDirection: 'row',
 alignItems: 'center',
 marginBottom: 24,
 paddingHorizontal: 16,
   marginTop: 40
},
headerTitle: {
   fontSize: 22,
   fontWeight: '600',
   marginLeft: 16,
   color: '#333',
 },
    inputGroup: {
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    siteContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginVertical: 8,
    },
    siteInputWrapper: {
        flex: 1,
    },
    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#333',
    },
    removeButton: {
        paddingTop: 12,
        marginLeft: 8,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2196F3',
        padding: 14,
        borderRadius: 10,
        marginTop: 12,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
    },
    map: {
        height: 280,
        borderRadius: 16,
        marginBottom: 20,
    },
    controls: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    button: {
        flex: 1,
        backgroundColor: '#2196F3',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#90caf9',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    resultsContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 20,
    },
    resultRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    resultLabel: {
        fontSize: 16,
        color: '#666',
    },
    resultValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
     suggestionItem: {
        padding: 12,
        backgroundColor: '#fff',
    },
    suggestionText: {
        fontSize: 16,
        color: '#333',
    },
});


export default MileageStartScreen;