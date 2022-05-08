import React from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, Alert, Image } from 'react-native';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native'
import { firebaseAccountValidator } from '../utils/validatorAccountFirebase';

const auth = getAuth();

const ForgotPassword: React.FC = () => {
  const navigation = useNavigation<any>()
  const [value, setValue] = React.useState({
    email: '',
    error: ''
  })

  async function handleResetPasswordEmail() {
    if (value.email === '') {
      setValue({
        ...value,
        error: 'Preencha o campo de E-mail.'
      })
      return;
    }

    try {
      await sendPasswordResetEmail(auth, value.email);
      Alert.alert(
        "Verifique seu e-mail",
        "Enviamos instruções de recuperação de senha para o seu e-mail",
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

      <RectButton style={styles.ForgotPasswordButton} onPress={handleResetPasswordEmail}>
        <Text style={styles.ForgotPasswordButtonText}>Recuperar</Text>
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

  ForgotPasswordButton: {
    backgroundColor: '#2DDA93',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    marginTop: 32,
  },

  ForgotPasswordButtonText: {
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

export default ForgotPassword;
