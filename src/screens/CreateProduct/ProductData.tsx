import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Switch, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import api from '../../services/api';

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

  const [open_on_weekends, setOpenOnWeekends] = useState(true);

  const navigation = useNavigation<any>();
  const routes = useRoute();
  const params = routes.params as ProductDataRouteParams;

  async function handleCreateOrphanage() {
    const address = params.address;

    const data = new FormData();
    
    data.append('name', name);
    data.append('brand', brand);
    data.append('type', type);
    data.append('price', price);
    data.append('description', description);
    data.append('phone', phone);
    data.append('lat', String(address.lat));
    data.append('long', String(address.long));
    data.append('country', address.country);
    data.append('uf', address.uf);
    data.append('city', address.city);
    data.append('street', address.street);
    data.append('number', address.number);

    images.forEach((image, index) => {
      data.append('images', {
        name: `image_${index}.jpg`,
        type: 'image/jpg',
        uri: image,
      } as any);
    });
    // console.log(images)
    // console.log(data)
    // await api.post('product', data);
    // console.log(data)
    // navigation.navigate('OrphanagesMap');
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

    // console.log({
    //   name,
    //   // latitude,
    //   // longitude,
    //   about,
    //   instructions,
    //   opening_hours,
    //   open_on_weekends,
    // });

    // console.log(result)

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
      <TextInput
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

      {/* <Text style={styles.label}>Whatsapp</Text>
      <TextInput
        style={styles.input}
      /> */}

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


      {/* <Text style={styles.label}>Instruções</Text>
      <TextInput
        style={[styles.input, { height: 110 }]}
        multiline
        value={type}
        onChangeText={setType}
      />

      <Text style={styles.label}>Horario de visitas</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
      /> */}



      {/* <View style={styles.switchContainer}>
        <Text style={styles.label}>Atende final de semana?</Text>
        <Switch
          thumbColor="#fff"
          trackColor={{ false: '#ccc', true: '#39CC83' }}
          value={open_on_weekends}
          onValueChange={setOpenOnWeekends}
        />
      </View> */}

      <Text style={styles.title}>Contato</Text>

      <Text style={styles.label}>Telefone</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType={'phone-pad'}
      />

      <RectButton style={styles.nextButton} onPress={handleCreateOrphanage}>
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
    marginTop: 16,
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
  }
})