import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Alert } from 'react-native';
import { updatePassword } from 'firebase/auth';
import { firebaseAccountValidator } from '../../utils/validatorAccountFirebase';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { AuthenticatedUserContext } from '../../navigation/AuthenticatedUserProvider';


export default function UpdatePassword() {
    const [value, setValue] = useState({
        email: '',
        password: '',
        confirmPassowrd: '',
        error: ''
    })

    const { user } = useContext(AuthenticatedUserContext);

    useEffect(() => {
        setValue({ ...value, email: user?.email! })
    }, []);


    async function handleUpdateUser() {
        if (value.password === '') {
            setValue({
                ...value,
                error: 'Preencha uma senha.'
            })
            return;
        }
        if (value.password !== value.confirmPassowrd) {
            setValue({
                ...value,
                error: 'Senhas não conferem.'
            })
            return;

        }

        try {
            if (value.password && value.password === value.confirmPassowrd) {
                await updatePassword(user!, value.password);
                Alert.alert(
                    "Senha atualizada com sucesso!",
                    "",
                    [
                        { text: "OK", onPress: () => { } }
                    ]
                );
            }
        } catch (error) {
            setValue({
                ...value,
                error: firebaseAccountValidator(error)
            })

        }
    }

    return (
        <ScrollView style={styles.updatePasswordContainer}>
            {!!value.error && <View style={styles.error}><Text>{value.error}</Text></View>}

            <Text style={styles.label}>E-mail</Text>
            <TextInput
                style={styles.input}
                value={value.email}
                onChangeText={(text) => setValue({ ...value, email: text })}
                defaultValue={user?.email!}
                editable={false}
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
                style={styles.input}
                secureTextEntry={true}
                value={value.password}
                onChangeText={(text) => setValue({ ...value, password: text })}
            />

            <Text style={styles.label}>Confirmar senha</Text>
            <TextInput
                style={styles.input}
                secureTextEntry={true}
                value={value.confirmPassowrd}
                onChangeText={(text) => setValue({ ...value, confirmPassowrd: text })}
            />

            <RectButton style={styles.nextButton} onPress={handleUpdateUser}>
                <Text style={styles.nextButtonText}>Atualizar</Text>
            </RectButton>
        </ScrollView>
    )
}


const styles = StyleSheet.create({

    updatePasswordContainer: {
        marginTop: 40,
    },

    title: {
        color: '#5c8599',
        fontSize: 24,
        fontFamily: 'Nunito_700Bold',
        marginBottom: 32,
        paddingBottom: 24,
        borderBottomWidth: 0.8,
        borderBottomColor: '#D3E2E6'
    },
    
    label: {
        color: '#8fa7b3',
        fontFamily: 'Nunito_600SemiBold',
        marginBottom: 8,
    },
    
    input: {
        backgroundColor: '#fff',
        borderWidth: 1.4,
        borderColor: '#d3e2e6',
        borderRadius: 20,
        height: 56,
        paddingVertical: 18,
        paddingHorizontal: 24,
        marginBottom: 16,
        textAlignVertical: 'top',
    },

    nextButton: {
        backgroundColor: '#2DDA93',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        height: 56,
        marginTop: 32,
    },

    nextButtonText: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 16,
        color: '#FFF',
    },

    error: {
        marginTop: 10,
        padding: 10,
        color: '#fff',
        backgroundColor: '#D54826FF',
    },
})

