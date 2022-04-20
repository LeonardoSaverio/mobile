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

import mapMarker from '../../images/map-marker.png';
// listar products por estado ou cidade, e renderizar novamente toda vez que mudar o estado ou cidade.
import api from "../../services/api";
import { RectButton } from "react-native-gesture-handler";

import ListProducts from "./ListProducts";


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

interface ProductProps {
    products: Product[];
}

export default function ({ products }: ProductProps) {
    const { user } = useAuthentication();
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    const navigation = useNavigation<any>();

    useEffect(()=> {
        loadPosition();
    }, [])

    async function loadPosition() {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Ooops...', 'Precisamos de sua permissão para obter a localização')
            return
        } else {
            try {
                const location = await Location.getCurrentPositionAsync()
                const { latitude, longitude } = location.coords
                setInitialPosition([latitude, longitude])
            } catch (err) {
                return
            }
        }
    }


    function handleNavigateToProductDetails(id: number) {
        navigation.navigate("ProductDetails", { id });
    }

    return (
        <>
            {initialPosition[0] !== 0 && (
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={{
                        latitude: initialPosition[0],
                        longitude: initialPosition[1],
                        latitudeDelta: 0.008,
                        longitudeDelta: 0.008,
                    }}
                    mapType="standard"
                    loadingEnabled={false}
                >
                    {products.map((product) => (
                        <Marker
                            key={product.id}
                            // icon={mapMarker}
                            calloutAnchor={{
                                x: 2.7,
                                y: 0.8,
                            }}
                            coordinate={{
                                latitude: Number(product.address.lat),
                                longitude: Number(product.address.long),
                            }}
                        >
                            <FontAwesome5 name="tractor" size={40} color="#6FCF97" />
                            <Callout
                                tooltip
                                onPress={() => handleNavigateToProductDetails(product.id)}
                            >
                                <View style={styles.calloutContainer}>
                                    <Text style={styles.calloutText}>{product.name}</Text>
                                </View>
                            </Callout>
                        </Marker>
                    ))}
                </MapView>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    map: {
        width: Dimensions.get("window").width,
        height: '90%',
    },

    calloutContainer: {
        width: 160,
        height: 46,
        paddingHorizontal: 16,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: 16,
        justifyContent: "center",
    },

    calloutText: {
        color: "#798184",
        fontSize: 12,
        fontFamily: "Nunito_700Bold",
    },

    button: {
        marginTop: 10
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

    footerText: {
        fontFamily: "Nunito_700Bold",
        color: "#8fa7b3",
    },

    headerTitleText: {
        fontFamily: "Nunito_700Bold",
        color: "#2DDA93",
        fontSize: 25,
        marginBottom: 8
    },
});
