import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, ScrollView, Button, TouchableNativeFeedback } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import Popover, { PopoverMode, PopoverPlacement } from 'react-native-popover-view';
import { useNavigation } from "@react-navigation/native";
import { RectButton } from "react-native-gesture-handler";

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



export default function ListProducts({ products }: ProductProps) {
    const navigation = useNavigation<any>();

    function handleNavigateToProductDetails(id: number) {
        navigation.navigate("ProductDetails", { id });
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>

            {products.length !== 0 ? (
                <>
                    {products.map(product => (
                        <TouchableNativeFeedback key={product.id} onPress={() => handleNavigateToProductDetails(product.id)}>
                            <View style={styles.productContainer}>
                                <Image
                                    source={{ uri: 'https://blog.jacto.com.br/wp-content/uploads/2020/07/cons%C3%B3rcio-de-maquinas-agr%C3%ADcolas.jpg' }}
                                    style={styles.image}
                                />

                                <View
                                    style={styles.productDescriptionContainer}
                                >
                                    <Text style={styles.productDescriptionContainerText}>{product.name}</Text>
                                    <Text style={styles.productDescriptionContainerText}>{product.price}</Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                    ))}
                </>
            ) : (
                <View>
                    <Text>Nenhum produto encontrado</Text>
                </View>
            )}
        </ScrollView>

    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        marginTop: 160,
        marginBottom: 80,
    },
    productContainer: {
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: 1.2,
        borderColor: "#B3DAE2",
        marginTop: 16,
        backgroundColor: "#fff",
    },

    image: {
        width: Dimensions.get("window").width,
        height: 150,
        resizeMode: "cover"
    },

    productDescriptionContainer: {
        padding: 16,
        display: 'flex',
        justifyContent: "space-between",
    },

    productDescriptionContainerText: {
        fontFamily: "Nunito_700Bold",
        color: "#8fa7b3",
        marginBottom: 6
    },

});