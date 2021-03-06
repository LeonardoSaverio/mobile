import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, Alert, Image } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native'
import { firebaseAccountValidator } from '../utils/validatorAccountFirebase';
import { Error } from '../shared/models/errorModel';
import api from '../services/api';
const auth = getAuth();

const SignInScreen: React.FC = () => {
  const navigation = useNavigation<any>()
  const [value, setValue] = React.useState({
    email: '',
    password: '',
    error: ''
  })

  async function signIn() {

    if (value.email === '' || value.password === '') {
      setValue({
        ...value,
        error: 'E-mail e senha são obrigatórios.'
      })
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, value.email, value.password);

      if (!userCredential.user.emailVerified) {
        Alert.alert(
          "Email não verificado!",
          "Por favor verificar seu email",
          [
            { text: "OK", onPress: () => { } }
          ]
        );
      } else {

        if (userCredential.user.emailVerified === true) {
          const data = {
            id: userCredential.user.uid,
            name: userCredential.user.displayName,
            email: userCredential.user.email,
            emailVerified: userCredential.user.emailVerified
          }
          api.post('register', data, {
            headers: {
              Authorization: `Bearer ${await userCredential.user.getIdToken()}`
            }
          }).then(res => console.log(res.data))
        }
      }
    } catch (error) {
      setValue({
        ...value,
        error: firebaseAccountValidator(error as Error)
      })
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
      <Image  style={{height: 140, width: 150, display: 'flex', alignSelf: 'center', marginBottom: 15}} source={require('../../assets/logo.png')} />

      {!!value.error && <View style={styles.error}><Text>{value.error}</Text></View>}
      <Text style={styles.label}>E-mail</Text>
      <TextInput
        placeholder='E-mail'
        autoCapitalize={'none'}
        style={styles.input}
        value={value.email}
        onChangeText={(text) => setValue({ ...value, email: text })}
      />
      <Text style={styles.label}>Senha</Text>
      <TextInput
        placeholder='Senha'
        style={styles.input}
        value={value.password}
        onChangeText={(text) => setValue({ ...value, password: text })}
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPasswordText}>Esqueci minha senha?</Text>
      </TouchableOpacity>

      <RectButton style={styles.loginButton} onPress={signIn}>
        <Text style={styles.loginButtonText}>Entrar</Text>
      </RectButton>
      <TouchableOpacity style={styles.createAccount} onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.createAccountText}>Não tem conta? Registre-se aqui</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

  loginButton: {
    backgroundColor: '#2DDA93',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    marginTop: 32,
  },

  loginButtonText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#FFF',
  },

  forgotPassword: {
    marginTop: 0,
    alignSelf: 'flex-end'
  },

  forgotPasswordText: {
    color: '#96A7AF',
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
  },

  createAccount: {
    marginTop: 20,
    alignSelf: 'center'
  },

  createAccountText: {
    color: '#96A7AF',
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
  },

  error: {
    marginTop: 10,
    padding: 10,
    color: '#fff',
    backgroundColor: '#D54826FF',
  }
});

export default SignInScreen;
