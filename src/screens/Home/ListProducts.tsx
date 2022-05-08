import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, ScrollView, Button, TouchableNativeFeedback, FlatList } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import Popover, { PopoverMode, PopoverPlacement } from 'react-native-popover-view';
import { useNavigation } from "@react-navigation/native";
import { RectButton } from "react-native-gesture-handler";
import { Product } from '../../shared/models/productModel';

interface ProductProps {
    products: Product[];
}


const Item = ({ product }: { product: Product }) => {
    const navigation = useNavigation<any>();

    function handleNavigateToProductDetails(id: number) {
        navigation.navigate("ProductDetails", { id });
    }

    return (
        <TouchableNativeFeedback onPress={() => { handleNavigateToProductDetails(product.id) }}>
            <View style={styles.productContainer}>
                <Image
                    source={{ uri: product.images[0] }}
                    style={styles.image}
                />
                <View
                    style={styles.productDescriptionContainer}
                >
                    <Text style={styles.productDescriptionContainerText}>{product.name}</Text>
                    <Text style={styles.productDescriptionContainerText}>{product.price} R$</Text>
                </View>
            </View>
        </TouchableNativeFeedback>
    );
}

export default function ListProducts({ products }: ProductProps) {



    const renderItem = (product: Product | any) => {
        return (
            <Item product={product.item} />
        )
    }


    return (
        <View style={styles.container} >
            <FlatList
                data={products as Product | any}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                initialNumToRender={10}
            />
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        marginTop: 160,
        marginBottom: 80,
        padding: 24,
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