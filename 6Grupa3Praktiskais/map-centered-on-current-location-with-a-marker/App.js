import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import MapView from 'react-native-maps';
import Marker from 'react-native-maps';
import Callout from 'react-native-maps';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [place, setPlace] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const getPlaceData = async (lat, lon) => {
    var linkAPI = 'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=00706fedeb62253f510db033ece9f517';

    try {
      const response = await fetch(linkAPI);
      const json = await response.json();
      setPlace(json.country);
      return json;
      
    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);
    if (errorMsg) {
      errorMsg;
    }
  };

  useEffect(() => {
    getCurrentLocation();
  });

  getPlaceData(latitude, longitude);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <MapView
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          style={styles.map}>
          <MapView.Marker
            style={styles.map}
            coordinate={{ latitude: latitude, longitude: longitude }}>
            <MapView.Callout>
              <View style={{ height: 100, width: 220 }}>
                <Text style={styles.text}>Place: {place}</Text>
                <Text style={styles.text}>Latitude: {latitude}</Text>
                <Text style={styles.text}>Longitude: {longitude}</Text>
              </View>
            </MapView.Callout>
          </MapView.Marker>
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  text: {
    fontSize: 18,
  },
});
