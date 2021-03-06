import React, { useEffect, useState } from "react";
import {
  Image,
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Linking,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Feather, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";
import { useRoute } from "@react-navigation/native";
import { Product } from '../../shared/models/productModel';
import api from "../../services/api";

interface ProductDetailsRouteParams {
  id: number;
}


export default function ProductDetails() {
  const route = useRoute();
  const [product, setProduct] = useState<Product>();
  const [activeIndex, setActiveIndex] = useState<any>(0);

  const params = route.params as ProductDetailsRouteParams;

  useEffect(() => {
    api.get(`product/${params.id}`).then((response) => {
      setProduct(response.data);
    });
  }, [params.id]);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.description}>Carregando...</Text>
      </View>
    );
  }

  function handleOpenGoogleMapRoutes() {
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${product?.address.lat},${product?.address.long}`
    );
  }

  function handleWhatsapp() {
    Linking.openURL(`whatsapp://send?phone=55${product?.phone}&text=Tenho interesse em seu produto ${product?.name}.`)
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imagesContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(event) => {
            setActiveIndex(Math.ceil(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width));
          }}
        >
          {product.images.map((image, index) => (
            <View key={index}>
              <Image
                style={styles.image}
                source={{ uri: image }}
              />
            </View>
          ))}
        </ScrollView>
        {
          product.images.length > 1 ?
            <View style={styles.dotsContainer}>
              {
                product.images.map((_, i) => (
                  <View key={i} style={[styles.dot, { backgroundColor: i === activeIndex ? '#fff' : 'rgba(255, 255, 255, 0.5);' }]} />
                ))
              }
            </View>
            : null
        }
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{product.name} - {product.brand}</Text>
        <Text style={{
          color: "#4D6F80",
          fontSize: 20,
          fontFamily: "Nunito_700Bold",
          marginBottom: 10,
          marginTop: 10
        }}>{product.type} - {product.price}R$</Text>

        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={{
            color: "#4D6F80",
            fontSize: 15,
            fontFamily: "Nunito_700Bold",
          }}>Disponivel para </Text>
          {product.adType.map(adType => (
            <View key={adType}  style={adType === 'SALE' ?  styles.scheduleItemGreen : styles.scheduleItemBlue }>
              <Text style={adType === 'SALE' ?  styles.scheduleTextGreen : styles.scheduleTextBlue }
              >{adType === 'SALE' ? 'Venda' : 'Aluguel'}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.mapContainer}>
          <MapView
            initialRegion={{
              latitude: Number(product.address.lat),
              longitude: Number(product.address.long),
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            }}
            zoomEnabled={false}
            pitchEnabled={false}
            scrollEnabled={false}
            rotateEnabled={false}
            style={styles.mapStyle}
          >
            <Marker
              coordinate={{
                latitude: Number(product.address.lat),
                longitude: Number(product.address.long),
              }}
            >
              <FontAwesome5 name="tractor" size={40} color="#6FCF97" />
            </Marker>
          </MapView>

          <TouchableOpacity
            onPress={handleOpenGoogleMapRoutes}
            style={styles.routesContainer}
          >
            <Text style={styles.routesText}>Ver rotas no Google Maps</Text>
          </TouchableOpacity>
        </View>

        <RectButton style={styles.contactButton} onPress={handleWhatsapp}>
          <FontAwesome name="whatsapp" size={24} color="#FFF" />
          <Text style={styles.contactButtonText}>Entrar em contato</Text>
        </RectButton>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  imagesContainer: {
    height: 240,
  },

  image: {
    width: Dimensions.get("window").width,
    height: 240,
    resizeMode: "cover",
  },

  dotsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    marginBottom: 8

  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },

  detailsContainer: {
    padding: 24,
  },

  title: {
    color: "#4D6F80",
    fontSize: 30,
    fontFamily: "Nunito_700Bold",
  },

  description: {
    fontFamily: "Nunito_600SemiBold",
    color: "#5c8599",
    lineHeight: 24,
    marginTop: 16,
  },

  mapContainer: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1.2,
    borderColor: "#B3DAE2",
    marginTop: 40,
    backgroundColor: "#E6F7FB",
  },

  mapStyle: {
    width: "100%",
    height: 150,
  },

  routesContainer: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  routesText: {
    fontFamily: "Nunito_700Bold",
    color: "#0089a5",
  },

  scheduleItemBlue: {
    backgroundColor: "#E6F7FB",
    borderWidth: 1,
    borderColor: "#B3DAE2",
    borderRadius: 20,
    paddingRight: 4,
    paddingLeft: 4,
    marginRight: 4
  },

  scheduleItemGreen: {
    backgroundColor: "#EDFFF6",
    borderWidth: 1,
    borderColor: "#A1E9C5",
    borderRadius: 20,
    paddingLeft: 4,
    paddingRight: 4,
    marginRight: 4
  },

  scheduleTextBlue: {
    color: "#5C8599",
    fontFamily: "Nunito_600SemiBold",
    fontSize: 15,
  },

  scheduleTextGreen: {
    color: "#37C77F",
    fontFamily: "Nunito_600SemiBold",
    fontSize: 15,
  },

  contactButton: {
    backgroundColor: "#3CDC8C",
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 56,
    marginTop: 40,
  },

  contactButtonText: {
    fontFamily: "Nunito_800ExtraBold",
    color: "#FFF",
    fontSize: 16,
    marginLeft: 16,
  },
});
