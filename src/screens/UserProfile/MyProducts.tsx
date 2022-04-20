import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import Popover, { PopoverMode, PopoverPlacement } from 'react-native-popover-view';




export default function MyProducts() {
    return (
        <View style={styles.productContainer}>
            <Image
                source={{ uri: 'https://blog.jacto.com.br/wp-content/uploads/2020/07/cons%C3%B3rcio-de-maquinas-agr%C3%ADcolas.jpg' }}
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
                    <TouchableOpacity style={{ marginBottom: 15 }} onPress={() => { console.log('Editar') }}>
                        <Text>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { console.log('Apagar') }}>
                        <Text>Apagar</Text>
                    </TouchableOpacity>
                </View>
            </Popover>

            <View
                style={styles.productDescriptionContainer}
            >
                <Text style={styles.productDescriptionContainerText}>Maquina agricola lorem ipsun aaaaa</Text>
                <Text style={styles.productDescriptionContainerText}>R$ 69000,00</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({


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
        justifyContent: "space-between",
    },

    productDescriptionContainerText: {
        fontFamily: "Nunito_700Bold",
        color: "#8fa7b3",
        marginBottom: 6
    },

});