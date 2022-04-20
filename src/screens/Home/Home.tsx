import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, Dimensions, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location'
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Feather, FontAwesome5, Ionicons, AntDesign } from "@expo/vector-icons";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { getAuth, signOut } from 'firebase/auth';
import { useAuthentication } from '../../utils/hooks/useAuthentication';

// listar products por estado ou cidade(do usuario logado), e renderizar novamente toda vez que mudar o estado ou cidade.
import api from "../../services/api";
import { RectButton } from "react-native-gesture-handler";

import ListProducts from "./ListProducts";
import ListProductsMap from "./ListProductsMap";

const auth = getAuth();

interface Product {
  id: number;
  name: string;
  brand: string;
  type: string;
  price: number;
  description: string;
  phone: string;
  images: string[];
  address: {
    long: number;
    lat: number;
  }
}

export default function HomeScreen() {
  const { user } = useAuthentication();
  const [products, setProducts] = useState<Product[]>([]);
  const [latLong, setLatLong] = useState<any>();
  const navigation = useNavigation<any>();
  const [changeListMode, setChangeListMode] = useState('map');

  useFocusEffect(
    useCallback(() => {
      api.get("/products").then((response) => {
        setProducts(response.data);
      }
      )
    }, [])
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
              placeholder='Pesquise seu endereço'
              onPress={(data, details = null) => {
                setLatLong(details?.geometry.location)
              }}
              query={{
                key: 'AIzaSyB6PvpBo3vldMd3igrBJZYIIbcaEMtWhc4',
                language: 'pt-BR',
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
            <ListProductsMap products={products}/>
          </>
        ) : (
          <ListProducts products={products} />
        )
      }


      <View style={styles.footer}>

        <RectButton
          onPress={() => signOut(auth)}
        >
          <AntDesign name="home" size={25} color="#fff" />

        </RectButton>
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
    paddingLeft: '10%',
    paddingRight: '10%',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  footerText: {
    fontFamily: "Nunito_700Bold",
    color: "#8fa7b3",
  },

});
