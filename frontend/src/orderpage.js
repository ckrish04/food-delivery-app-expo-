import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Modal, TextInput, ScrollView, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";

const OrderPage = () => {
  const [juices, setJuices] = useState([]);
  const [canteenItems, setCanteenItems] = useState([]);
  const [ganeshFoods, setGaneshFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from backend
    const fetchData = async () => {
      try {
        const [juicesRes, canteenRes, ganeshFoodsRes] = await Promise.all([
          axios.get("http://localhost:5000/Juices"),
          axios.get("http://localhost:5000/Canteen"),
          axios.get("http://localhost:5000/GaneshFoods"),
        ]);

        setJuices(juicesRes.data);
        setCanteenItems(canteenRes.data);
        setGaneshFoods(ganeshFoodsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openFoodDetails = (food) => {
    setSelectedFood(food);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedFood(null);
  };

  return (
    <LinearGradient colors={["#FFFFFF", "#F5F5F5"]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TextInput style={styles.searchBar} placeholder="Search for dishes or restaurants" placeholderTextColor="#777" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#FF7043" />
        ) : (
          <>
            {/* Juices Section */}
            <Text style={styles.sectionTitle}>Juices</Text>
            <FlatList
              data={juices}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => `juice-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.recommendedCard} onPress={() => openFoodDetails(item)}>
                  <Image source={{ uri: item.image }} style={styles.recommendedImage} />
                  <Text style={styles.recommendedText}>{item.name}</Text>
                  <Text style={styles.recommendedPrice}>₹{item.price}</Text>
                </TouchableOpacity>
              )}
            />

            {/* Canteen Section */}
            <Text style={styles.sectionTitle}>Canteen</Text>
            <FlatList
              data={canteenItems}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => `canteen-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.recommendedCard} onPress={() => openFoodDetails(item)}>
                  <Image source={{ uri: item.image }} style={styles.recommendedImage} />
                  <Text style={styles.recommendedText}>{item.name}</Text>
                  <Text style={styles.recommendedPrice}>₹{item.price}</Text>
                </TouchableOpacity>
              )}
            />

            {/* Ganesh Foods Section */}
            <Text style={styles.sectionTitle}>Sri Sai Ganesh Foods</Text>
            <FlatList
              data={ganeshFoods}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => `ganesh-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.recommendedCard} onPress={() => openFoodDetails(item)}>
                  <Image source={{ uri: item.image }} style={styles.recommendedImage} />
                  <Text style={styles.recommendedText}>{item.name}</Text>
                  <Text style={styles.recommendedPrice}>₹{item.price}</Text>
                </TouchableOpacity>
              )}
            />
          </>
        )}
      </ScrollView>

      {/* Modal for Food Details */}
      {selectedFood && (
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image source={{ uri: selectedFood.image }} style={styles.modalImage} />
              <Text style={styles.modalTitle}>{selectedFood.name}</Text>
              <Text style={styles.modalText}>Price: ₹{selectedFood.price}</Text>
              <Text style={styles.modalText}>Description: {selectedFood.description}</Text>
              <TouchableOpacity style={styles.addToCartButton} onPress={closeModal}>
                <Text style={styles.buttonText}>Add to Cart</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { marginVertical: 10 },
  searchBar: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
  },
  recommendedCard: {
    marginRight: 15,
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  recommendedImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  recommendedText: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
    color: "#333",
  },
  recommendedPrice: { fontSize: 14, color: "#888" },
  modalContainer: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#FFF", margin: 20, padding: 20, borderRadius: 10, alignItems: "center" },
  modalImage: { width: 150, height: 150, borderRadius: 10, marginBottom: 10 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalText: { fontSize: 16, marginBottom: 10 },
  addToCartButton: { backgroundColor: "#FF7043", padding: 10, borderRadius: 5, marginVertical: 5 },
  closeButton: { backgroundColor: "#FF7043", padding: 10, borderRadius: 5, marginVertical: 5 },
  buttonText: { color: "#FFF", fontWeight: "bold" },
});

export default OrderPage;
