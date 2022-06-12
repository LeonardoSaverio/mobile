import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Text, TextInput, TouchableOpacity, Image, Switch, Alert } from 'react-native';
import MaskInput, { Masks } from 'react-native-mask-input';
import { Feather } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import api from '../../services/api';
import { StatusAd, AdType } from '../../shared/models/productModel';
import { defaultMessages, defaultRules, useValidation } from 'react-simple-form-validator';

interface ProductDataRouteParams {
  address: {
    country: string;
    uf: string;
    city: string;
    street: string;
    number: string;
    lat: number;
    long: number;
  }
}

export default function OrphanageData() {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [rent, setRent] = useState(false);
  const [sale, setSale] = useState(false);


  const { isFieldInError, getErrorsInField, isFormValid, getErrorMessages } = useValidation({
    fieldsRules: {
      name: { required: true },
      brand: { required: true },
      type: { required: true },
      price: { required: true },
      images: { required: true },
      description: { required: true },
      phone: { required: true, minlength: 15 },
    },
    state: { name, brand, type, price, images, description, phone },
    locale: 'ptBR',
    labels: {
      name: "Nome",
      brand: "Marca",
      type: "Tipo",
      price: "Preço",
      images: "Fotos",
      description: "Descrição",
      phone: "Telefone"
    },
    messages: {
      ...defaultMessages,
      ptBR: { ...defaultMessages['ptBR'], minlength: phone && 'O campo "Telefone" é inválido.' }
    }
  });

  const navigation = useNavigation<any>();
  const routes = useRoute();
  const params = routes.params as ProductDataRouteParams;

  function selectedAdType() {
    if (rent && sale) {
      return `{${AdType.SALE}, ${AdType.RENT}}`
    } else if (rent) {
      return `{${AdType.RENT}}`
    } else {
      return `{${AdType.SALE}}`
    }
  }

  async function handleCreateProduct() {
    const address = params.address;

    const data = new FormData();

    data.append('name', name);
    data.append('brand', brand);
    data.append('type', type);
    data.append('price', price);
    data.append('description', description);
    data.append('phone', phone);
    data.append('adType', selectedAdType());
    data.append('lat', String(address.lat));
    data.append('long', String(address.long));
    data.append('country', address.country);
    data.append('uf', address.uf);
    data.append('city', address.city);
    data.append('street', address.street);
    data.append('number', address.number || String(0));

    images.forEach((image, index) => {
      data.append('images', {
        name: `image_${index}.jpg`,
        type: 'image/jpg',
        uri: image,
      } as any);
    });

    if (isFormValid) {
      await api.post('product', data);

      Alert.alert('Sucesso', 'Cadastro realizado.', [{ onPress: () => navigation.navigate('Home') }])
    } else {
      Alert.alert('Preencha os seguintes campos', getErrorMessages())
    }
  }

  async function handleSelectImages() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('Eita, precisamos de acesso às suas fotos!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });


    if (result.cancelled) {
      return;
    }

    const { uri: image } = result;
    setImages([...images, image]);
  }

  function removeImage(value: string) {
    const newImages = images.filter((image) => image !== value)
    setImages(newImages)
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
      <Text style={styles.title}>Dados</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Marca</Text>
      <TextInput
        style={styles.input}
        value={brand}
        onChangeText={setBrand}
      />

      <Text style={styles.label}>Tipo</Text>
      <TextInput
        style={styles.input}
        value={type}
        onChangeText={setType}
      />

      <Text style={styles.label}>Preço</Text>
      <MaskInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType={'numeric'}
      />


      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, { height: 110 }]}
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Fotos</Text>
      <View style={styles.uploadedImagesContaier}>
        {images.map(image => (
          <View key={image}>
            <Image
              source={{ uri: image }}
              style={styles.uploadedImage}
            />
            <TouchableOpacity style={{
              position: 'absolute',
              right: 10,
              top: 2,
            }}
              onPress={() => removeImage(image)}
            >
              <Feather name="x-circle" size={20} color="#FD5D5D" />
            </TouchableOpacity>

          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.imagesInput} onPress={handleSelectImages}>
        <Feather name="plus" size={24} color="#15B6D6" />
      </TouchableOpacity>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Deseja alugar?</Text>
        <Switch
          thumbColor="#fff"
          trackColor={{ false: '#ccc', true: '#39CC83' }}
          value={rent}
          onValueChange={setRent}
        />
        <Text style={styles.label}>Deseja vender?</Text>
        <Switch
          thumbColor="#fff"
          trackColor={{ false: '#ccc', true: '#39CC83' }}
          value={sale}
          onValueChange={setSale}
        />
      </View>

      <Text style={styles.title}>Contato</Text>

      <Text style={styles.label}>Telefone</Text>
      <MaskInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        mask={Masks.BRL_PHONE}
        keyboardType={'phone-pad'}
      />

      <RectButton style={styles.nextButton} onPress={handleCreateProduct}>
        <Text style={styles.nextButtonText}>Cadastrar</Text>
      </RectButton>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

  comment: {
    fontSize: 11,
    color: '#8fa7b3',
  },

  uploadedImagesContaier: {
    flexDirection: 'row',
  },

  uploadedImage: {
    width: 64,
    height: 64,
    borderRadius: 5,
    marginBottom: 32,
    marginRight: 8,
  },

  imagesInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderStyle: 'dashed',
    borderColor: '#96D2F0',
    borderWidth: 1.4,
    borderRadius: 20,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },

  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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

  errorText: {
    color: '#c55252',
    fontSize: 12,
    marginLeft: 10,
    marginTop: -16
  }
})