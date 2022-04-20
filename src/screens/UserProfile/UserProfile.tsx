import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { SimpleLineIcons } from '@expo/vector-icons';
import UpdatePassword from './UpdatePassword';
import MyProducts from './MyProducts';
import { getAuth, signOut } from 'firebase/auth';


export default function SelectMapPosition() {
    const navigation = useNavigation<any>();

    const [changeProfile, setChangeProfile] = useState('profile');
    const auth = getAuth();

    function handleChangeProfile(value: string) {
        if (value === 'profile') {
            setChangeProfile('profile')
        } else {
            setChangeProfile('product')
        }
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
            <TouchableOpacity style={styles.logoutButton} onPress={()=> signOut(auth)}>
                <SimpleLineIcons name="logout" size={24} color="#5c8599" />
            </TouchableOpacity>
            <View style={styles.headerChange}>
                <RectButton style={changeProfile === 'profile' ? styles.changeButtonActive : styles.changeButtonInactive} onPress={() => handleChangeProfile('profile')}>
                    <Text style={changeProfile === 'profile' ? styles.changeButtonActiveText : styles.changeButtonInactiveText}>Perfil</Text>
                </RectButton>
                <RectButton style={changeProfile === 'product' ? styles.changeButtonActive : styles.changeButtonInactive} onPress={() => handleChangeProfile('product')}>
                    <Text style={changeProfile === 'product' ? styles.changeButtonActiveText : styles.changeButtonInactiveText}>Produtos</Text>
                </RectButton>
            </View>

            {changeProfile === 'profile' ? (
                <UpdatePassword />
            ) : (
                <MyProducts />
            )}

        </ScrollView>

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    headerChange: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    changeButtonActive: {
        backgroundColor: '#2DDA93',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        height: 56,
        width: '50%'
    },

    changeButtonActiveText: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 16,
        color: '#fff'
    },

    changeButtonInactive: {
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        height: 56,
        width: '50%',
    },

    changeButtonInactiveText: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 16,
        color: '#C5C5C5'
    },

    logoutButton: {
        alignSelf: 'flex-end',
        marginBottom: 26
    }
});
