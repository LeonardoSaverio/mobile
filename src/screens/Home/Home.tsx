import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Feather, FontAwesome5, Ionicons, AntDesign } from "@expo/vector-icons";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { getAuth } from 'firebase/auth';

import api from "../../services/api";
import { RectButton } from "react-native-gesture-handler";

import ListProducts from "./ListProducts";
import ListProductsMap from "./ListProductsMap";
import { Product } from '../../shared/models/productModel';


export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [city, setCity] = useState<any>();
  const [uf, setUf] = useState<any>();
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const navigation = useNavigation<any>();
  const [changeListMode, setChangeListMode] = useState('map');

  useFocusEffect(
    useCallback(() => {
      api.get(`/product/?uf=${uf || ''}&city=${city || ''}`).then((response) => {
        setProducts(response.data);
      }
      )
    }, [uf, city])
  );


  return (

    <SafeAreaView style={styles.container}>
      <View style={{ position: 'absolute', width: '100%', zIndex: 9999, paddingTop: 15 + Constants.statusBarHeight, backgroundColor: '#f2f3f5' }}>
        <View style={{ marginRight: 10, marginLeft: 10, marginBottom: 5 }}>
          <Text style={styles.headerTitleText}>O que você está buscando?</Text>
          <Text style={styles.productQtd}>{products.length} produtos encontrados</Text>
        </View>
        <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginRight: 10, marginLeft: 10 }}>
          <View style={{ width: '90%' }}>
            <GooglePlacesAutocomplete
              placeholder='Pesquise pela localização'
              onPress={(data, details) => {
                const address_components = details?.address_components
                const uf = address_components?.find(item => item.types.includes('administrative_area_level_1'))?.short_name
                const city = address_components?.find(item => item.types.includes('administrative_area_level_2'))?.long_name
                setUf(uf)
                setCity(city)
                setPosition({
                  latitude: details!.geometry.location.lat,
                  longitude: details!.geometry.location.lng,
                })
              }}
              query={{
                key: 'AIzaSyB6PvpBo3vldMd3igrBJZYIIbcaEMtWhc4',
                language: 'pt-BR',
                components: 'country:br',
                type: '(cities)',
              }}
              enablePoweredByContainer={false}
              fetchDetails={true}
            />
          </View>
          {
            changeListMode === 'map' ? (
              <TouchableOpacity style={{}} onPress={() => { setChangeListMode('list') }}>
                <FontAwesome5 name="map-marked-alt" size={24} color="#798184" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={{}} onPress={() => { setChangeListMode('map') }}>
                <Feather name="list" size={24} color="#798184" />
              </TouchableOpacity>
            )
          }
        </View>
      </View>
      {
        changeListMode === 'map' ? (
          <>
            <ListProductsMap products={products} latLng={[position.latitude, position.longitude]} />
          </>
        ) : (
          <ListProducts products={products} />
        )
      }


      <View style={styles.footer}>
        <RectButton
          onPress={() => navigation.navigate('SelectMapPosition')}
        >
          <Feather name="plus" size={25} color="#fff" />
        </RectButton>

        <RectButton
          onPress={() => navigation.navigate('UserProfile')}
        >
          <Ionicons name="ios-person-outline" size={25} color="#fff" />
        </RectButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  productQtd: {
    color: '#798184',
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
  },

  header: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: "#fff",
    borderRadius: 20,
    height: 56,
    paddingLeft: 24,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    elevation: 3,
  },

  headerTitleText: {
    fontFamily: "Nunito_700Bold",
    color: "#2DDA93",
    fontSize: 25,
    marginBottom: 8
  },

  footer: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "#6FCF97",
    height: '10%',
    width: '100%',
    paddingLeft: '20%',
    paddingRight: '20%',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  footerText: {
    fontFamily: "Nunito_700Bold",
    color: "#8fa7b3",
  },

});
