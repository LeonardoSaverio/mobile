import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import Constants from 'expo-constants';
import { useNavigation } from "@react-navigation/native";
import { RectButton } from "react-native-gesture-handler";
import MapView, { MapEvent, Marker } from "react-native-maps";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

export default function SelectMapPosition() {
  const navigation = useNavigation<any>();
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [address, setAddress] = useState({
    country: '',
    uf: '',
    city: '',
    street: '',
    number: '',
    lat: 0,
    long: 0,
  });
  function handleNextStep() {
    navigation.navigate("ProductData", { address });
  }

  // function handleSelectMapPosition(event: MapEvent) {
  //   setPosition(event.nativeEvent.coordinate);
  // }

  return (
    <View style={styles.container}>
      <View style={{ position: 'absolute', zIndex: 9999, top: 40, left: 24, right: 24 }}>
        <GooglePlacesAutocomplete
          placeholder='Pesquise pela localização'
          onPress={(data, details = null) => {
            setPosition({
              latitude: details!.geometry.location.lat,
              longitude: details!.geometry.location.lng,
            })
            const address_components = details?.address_components
            const country = address_components?.find(item => item.types.includes('country'))?.short_name
            const state = address_components?.find(item => item.types.includes('administrative_area_level_1'))?.short_name
            const city = address_components?.find(item => item.types.includes('administrative_area_level_2'))?.long_name
            const street = address_components?.find(item => item.types.includes('route'))?.long_name
            const number = address_components?.find(item => item.types.includes('street_number'))?.long_name
            setAddress({
              country: country!,
              uf: state!,
              city: city!,
              street: street!,
              number: number!,
              lat: details!.geometry.location.lat,
              long: details!.geometry.location.lng
            })
          }}
          query={{
            key: 'AIzaSyB6PvpBo3vldMd3igrBJZYIIbcaEMtWhc4',
            language: 'pt-BR',
            components: 'country:br',
            type: 'address',
          }}
          enablePoweredByContainer={false}
          fetchDetails={true}
        />
      </View>
      <MapView
        region={{
          latitude: position.latitude,
          longitude: position.longitude,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
        mapType="standard"
        loadingEnabled={true}
        style={styles.mapStyle}
      >
        {position.latitude !== 0 && (
          <Marker
            coordinate={{
              latitude: position.latitude,
              longitude: position.longitude,
            }}

          >
            <MaterialCommunityIcons name="map-marker-radius" size={80} color="#2DDA93" />
          </Marker>
        )}
      </MapView>

      {position.latitude !== 0 && (
        <RectButton style={styles.nextButton} onPress={handleNextStep}>
          <Text style={styles.nextButtonText}>Próximo</Text>
        </RectButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },

  nextButton: {
    backgroundColor: "#2DDA93",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 56,

    position: "absolute",
    left: 24,
    right: 24,
    bottom: 40,
  },

  nextButtonText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 16,
    color: "#FFF",
  },
});
