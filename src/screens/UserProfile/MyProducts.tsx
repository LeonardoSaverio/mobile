import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, ScrollView, TouchableNativeFeedback, FlatList, Alert } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import Popover, { PopoverMode, PopoverPlacement } from 'react-native-popover-view';
import api from "../../services/api";
import { Product, StatusAd } from '../../shared/models/productModel';
import { useNavigation } from "@react-navigation/native";
import SelectDropdown from 'react-native-select-dropdown'




export default function MyProducts() {
    const [myProducts, setMyProducts] = useState<Product[]>([]);

    useEffect(() => {
        api.get('myproduct').then(response => setMyProducts(response.data))
    }, [myProducts])

    const navigation = useNavigation<any>();

    function handleNavigateToProductDetails(id: number) {
        navigation.navigate("ProductDetails", { id });
    }

    function confirmPartyDeletion(id: number) {
        Alert.alert('Remover', 'Deseja remover o anuncio?', [
            {
                text: 'Sim',
                onPress() {
                    handleDeleteProduct(id)
                }
            },
            {
                text: 'Não'
            }
        ])
    }

    function changeProductStatus(id: number, status?: StatusAd) {
        const data = new FormData();
        const statusAd = statusAds.find(v => v.label === status)?.value
        if (statusAd === StatusAd.ANNOUNCED) {
            data.append('statusAd', StatusAd.ANNOUNCED)
        } else if (statusAd === StatusAd.RENTED) {
            data.append('statusAd', StatusAd.RENTED)
        } else if (statusAd === StatusAd.SOLD) {
            data.append('statusAd', StatusAd.SOLD)
        }
        api.patch(`product/${id}`, data).then(() => { })
    }

    function handleDeleteProduct(id: number) {
        api.delete(`product/${id}`).then(() => { setMyProducts(myProducts.filter(product => product.id !== id)) })
    }

    const statusAds = [
        {
            label: 'Anúnciado',
            value: StatusAd.ANNOUNCED
        },
        {
            label: 'Alugado',
            value: StatusAd.RENTED,
        },
        {
            label: 'Vendido',
            value: StatusAd.SOLD,
        },
    ]

    const renderItem = (productItem: Product | any) => {
        const product = productItem.item as Product
        return (
            <TouchableNativeFeedback >
                <View style={styles.productContainer}>
                    <Image
                        source={{ uri: product.images[0] }}
                        style={styles.image}
                    />
                    <Popover
                        mode={PopoverMode.JS_MODAL}
                        placement={PopoverPlacement.LEFT}
                        popoverStyle={{ padding: 10 }}
                        backgroundStyle={{ opacity: 0 }}
                        from={(
                            <TouchableOpacity style={{
                                position: 'absolute',
                                right: 10,
                                top: 15
                            }}>
                                <Entypo name="dots-three-vertical" size={24} color="#FFF" />
                            </TouchableOpacity>
                        )}>
                        <View>
                            <TouchableOpacity style={{ marginBottom: 15 }} onPress={() => { handleNavigateToProductDetails(product.id) }}>
                                <Text>Detalhes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { confirmPartyDeletion(product.id) }}>
                                <Text>Apagar</Text>
                            </TouchableOpacity>
                        </View>
                    </Popover>

                    <View
                        style={styles.productDescriptionContainer}
                    >
                        <View style={{maxWidth: 150}}>
                            <Text numberOfLines={1}  style={styles.productDescriptionContainerText}>{product.name}</Text>
                            <Text style={styles.productDescriptionContainerText}>{product.price} R$</Text>
                        </View>
                        <View >
                            <SelectDropdown
                                buttonStyle={{ borderRadius: 8, height: 30, width: 150 }}
                                buttonTextStyle={{
                                    fontFamily: "Nunito_600SemiBold",
                                    color: "#8fa7b3",
                                }}
                                rowTextStyle={{
                                    fontFamily: "Nunito_600SemiBold",
                                }}
                                dropdownIconPosition='right'
                                renderDropdownIcon={() => <Entypo name="chevron-down" size={24} color="#798184" />}
                                defaultButtonText={statusAds.find(v => v.value === product.statusAd)?.label}
                                data={statusAds.map(v => v.label)}
                                onSelect={(selectedItem, index) => {
                                    changeProductStatus(product.id, selectedItem)
                                }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    // text represented after item is selected
                                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                                    return selectedItem
                                }}
                                rowTextForSelection={(item, index) => {
                                    // text represented for each item in dropdown
                                    // if data array is an array of objects then return item.property to represent item in dropdown
                                    return item
                                }}
                            />
                        </View>
                    </View>
                </View>
            </TouchableNativeFeedback>
        )
    }

    return (

        <View style={styles.container} >
            <FlatList
                data={myProducts as Product | any}
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
        marginTop: 10,
        // marginBottom: 80,
    },

    productContainer: {
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: 1.2,
        borderColor: "#B3DAE2",
        marginTop: 40,
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
        flexDirection: 'row',
        justifyContent: "space-between",
    },

    productDescriptionContainerText: {
        fontFamily: "Nunito_700Bold",
        color: "#8fa7b3",
        marginBottom: 6
    },

});