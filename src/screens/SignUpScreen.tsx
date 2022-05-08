import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, Alert, Image } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';
import { firebaseAccountValidator } from '../utils/validatorAccountFirebase'
const auth = getAuth();

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<any>()
  const [value, setValue] = React.useState({
    email: '',
    password: '',
    confirmPassowrd: '',
    error: ''
  })

  async function signUp() {
    if (value.email === '' || value.password === '') {
      setValue({
        ...value,
        error: 'E-mail e senha são obrigatórios.'
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
      const userCredential = await createUserWithEmailAndPassword(auth, value.email, value.password);
      await sendEmailVerification(userCredential.user);
      await signOut(auth);
      Alert.alert(
        "Cadastro realizado com sucesso!",
        "Enviamos instruções para ativar sua conta",
        [
          { text: "OK", onPress: () => navigation.navigate("SignIn") }
        ]
      );
    } catch (error) {
      setValue({
        ...value,
        error: firebaseAccountValidator(error)
      })

    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
      <Image style={{ height: 140, width: 150, display: 'flex', alignSelf: 'center', marginBottom: 15 }} source={require('../../assets/logo.png')} />

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

      <Text style={styles.label}>Confirmar senha</Text>
      <TextInput
        placeholder='Confirmar senha'
        style={styles.input}
        value={value.confirmPassowrd}
        onChangeText={(text) => setValue({ ...value, confirmPassowrd: text })}
        secureTextEntry={true}
      />

      <RectButton style={styles.signUpButton} onPress={signUp}>
        <Text style={styles.signUpButtonText}>Cadastrar-se</Text>
      </RectButton>
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

  signUpButton: {
    backgroundColor: '#2DDA93',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    marginTop: 32,
  },

  signUpButtonText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#FFF',
  },

  error: {
    marginTop: 10,
    padding: 10,
    color: '#fff',
    backgroundColor: '#D54826FF',
  }
});

export default SignUpScreen;
