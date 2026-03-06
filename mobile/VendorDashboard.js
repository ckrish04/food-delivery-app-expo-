import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Image, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const inr = (amount) => `₹${Number(amount || 0).toFixed(0)}`;

const getPickedImageData = (asset) => {
  if (!asset) {
    return "";
  }

  if (asset.base64) {
    const mime = asset.mimeType || "image/jpeg";
    return `data:${mime};base64,${asset.base64}`;
  }

  return asset.uri || "";
};

export default function VendorDashboard({
  vendor,
  orders = [],
  vendorItems = [],
  onRefresh,
  onMigrateLegacy,
  onPublishItem,
  onUpdateItem,
  onDeleteItem,
  publishNote,
  migrationNote,
  onLogout,
}) {
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const [showLaunchForm, setShowLaunchForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", price: "", prepTime: "", description: "", image: "" });
  const [editingItemId, setEditingItemId] = useState("");
  const [editItem, setEditItem] = useState({ name: "", price: "", prepTime: "", description: "", image: "" });

  const launchItem = async () => {
    const ok = await onPublishItem?.(newItem);
    if (!ok) {
      return;
    }
    setNewItem({ name: "", price: "", prepTime: "", description: "", image: "" });
    setShowLaunchForm(false);
  };

  const startEditItem = (item) => {
    setEditingItemId(item.id);
    setEditItem({
      name: item.name || "",
      price: String(item.price || ""),
      prepTime: item.prepTime || "",
      description: item.description || "",
      image: typeof item.image === "string" ? item.image : "",
    });
  };

  const saveEditedItem = async () => {
    if (!editingItemId) {
      return;
    }

    const ok = await onUpdateItem?.(editingItemId, editItem);
    if (!ok) {
      return;
    }
    setEditingItemId("");
    setEditItem({ name: "", price: "", prepTime: "", description: "", image: "" });
  };

  const pickNewItemFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.6,
      base64: true,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    const imageData = getPickedImageData(result.assets[0]);
    setNewItem((prev) => ({ ...prev, image: imageData }));
  };

  const pickNewItemFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.6,
      base64: true,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    const imageData = getPickedImageData(result.assets[0]);
    setNewItem((prev) => ({ ...prev, image: imageData }));
  };

  const pickEditItemFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.6,
      base64: true,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    const imageData = getPickedImageData(result.assets[0]);
    setEditItem((prev) => ({ ...prev, image: imageData }));
  };

  const pickEditItemFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.6,
      base64: true,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    const imageData = getPickedImageData(result.assets[0]);
    setEditItem((prev) => ({ ...prev, image: imageData }));
  };

  return (
    <LinearGradient
      colors={["#f5fbff", "#f6f5ff", "#fff6fb", "#fff9f3"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Vendor Console</Text>
            <Text style={styles.headerSub}>{vendor?.name} • {vendor?.email}</Text>
            {!!vendor?.vendorCanteenName && <Text style={styles.headerSub}>Canteen: {vendor.vendorCanteenName}</Text>}
          </View>
          <View style={styles.headerActions}>
            <Pressable style={styles.actionBtn} onPress={onRefresh}>
              <Ionicons name="refresh" size={16} color="#d95022" />
              <Text style={styles.actionText}>Refresh</Text>
            </Pressable>
            <Pressable style={styles.actionBtn} onPress={onMigrateLegacy}>
              <Ionicons name="build-outline" size={16} color="#d95022" />
              <Text style={styles.actionText}>Repair</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.logoutRow}>
          <Pressable style={styles.logoutBtn} onPress={onLogout}>
            <Ionicons name="log-out-outline" size={16} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>

        {!!migrationNote && (
          <View style={styles.noteWrap}>
            <Text style={styles.noteText}>{migrationNote}</Text>
          </View>
        )}

        <View style={styles.panelCard}>
          <Pressable style={styles.launchBtn} onPress={() => setShowLaunchForm((prev) => !prev)}>
            <Ionicons name={showLaunchForm ? "chevron-up-outline" : "add-circle-outline"} size={17} color="#fff" />
            <Text style={styles.launchBtnText}>Add Item</Text>
          </Pressable>

          {showLaunchForm && (
            <>
              <Text style={styles.panelTitle}>Launch New Item</Text>
              <Text style={styles.panelSub}>Add a new item to your canteen. It will appear directly on the user menu.</Text>

              <TextInput
                style={styles.input}
                value={newItem.name}
                onChangeText={(text) => setNewItem((prev) => ({ ...prev, name: text }))}
                placeholder="Item name"
              />
              <TextInput
                style={styles.input}
                value={newItem.price}
                onChangeText={(text) => setNewItem((prev) => ({ ...prev, price: text }))}
                placeholder="Price"
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                value={newItem.prepTime}
                onChangeText={(text) => setNewItem((prev) => ({ ...prev, prepTime: text }))}
                placeholder="Prep time (e.g. 10 min)"
              />
              {!!newItem.image && <Image source={{ uri: newItem.image }} style={styles.itemPreviewImage} resizeMode="cover" />}

              <View style={styles.inlineActions}>
                <Pressable style={styles.actionGhostBtn} onPress={pickNewItemFromGallery}>
                  <Text style={styles.actionGhostText}>Gallery</Text>
                </Pressable>
                <Pressable style={styles.actionGhostBtn} onPress={pickNewItemFromCamera}>
                  <Text style={styles.actionGhostText}>Camera</Text>
                </Pressable>
              </View>

              <TextInput
                style={[styles.input, styles.inputMulti]}
                value={newItem.description}
                onChangeText={(text) => setNewItem((prev) => ({ ...prev, description: text }))}
                placeholder="Short description"
                multiline
              />

              <View style={styles.inlineActions}>
                <Pressable style={[styles.launchBtn, styles.launchBtnInline]} onPress={launchItem}>
                  <Ionicons name="add-circle-outline" size={17} color="#fff" />
                  <Text style={styles.launchBtnText}>Launch</Text>
                </Pressable>
                <Pressable style={styles.actionGhostBtn} onPress={() => setShowLaunchForm(false)}>
                  <Text style={styles.actionGhostText}>Cancel</Text>
                </Pressable>
              </View>
            </>
          )}

          {!!publishNote && <Text style={styles.publishNote}>{publishNote}</Text>}
        </View>

        <View style={styles.panelCard}>
          <Text style={styles.panelTitle}>Your Launched Items</Text>
          <Text style={styles.panelSub}>Edit or remove items you added for {vendor?.vendorCanteenName || "your canteen"}.</Text>

          {!vendorItems.length ? (
            <Text style={styles.emptyInline}>No launched items yet.</Text>
          ) : (
            vendorItems.map((item) => {
              const isEditing = editingItemId === item.id;

              return (
                <View key={item.id} style={styles.launchedItemCard}>
                  {isEditing ? (
                    <>
                      <TextInput
                        style={styles.input}
                        value={editItem.name}
                        onChangeText={(text) => setEditItem((prev) => ({ ...prev, name: text }))}
                        placeholder="Item name"
                      />
                      <TextInput
                        style={styles.input}
                        value={editItem.price}
                        onChangeText={(text) => setEditItem((prev) => ({ ...prev, price: text }))}
                        placeholder="Price"
                        keyboardType="numeric"
                      />
                      <TextInput
                        style={styles.input}
                        value={editItem.prepTime}
                        onChangeText={(text) => setEditItem((prev) => ({ ...prev, prepTime: text }))}
                        placeholder="Prep time"
                      />
                      <TextInput
                        style={[styles.input, styles.inputMulti]}
                        value={editItem.description}
                        onChangeText={(text) => setEditItem((prev) => ({ ...prev, description: text }))}
                        placeholder="Description"
                        multiline
                      />
                      {!!editItem.image && <Image source={{ uri: editItem.image }} style={styles.itemPreviewImage} resizeMode="cover" />}

                      <View style={styles.inlineActions}>
                        <Pressable style={styles.actionGhostBtn} onPress={pickEditItemFromGallery}>
                          <Text style={styles.actionGhostText}>Gallery</Text>
                        </Pressable>
                        <Pressable style={styles.actionGhostBtn} onPress={pickEditItemFromCamera}>
                          <Text style={styles.actionGhostText}>Camera</Text>
                        </Pressable>
                      </View>

                      <View style={styles.inlineActions}>
                        <Pressable style={styles.actionSolidBtn} onPress={saveEditedItem}>
                          <Text style={styles.actionSolidText}>Save</Text>
                        </Pressable>
                        <Pressable style={styles.actionGhostBtn} onPress={() => setEditingItemId("") }>
                          <Text style={styles.actionGhostText}>Cancel</Text>
                        </Pressable>
                      </View>
                    </>
                  ) : (
                    <>
                      {!!item.image && <Image source={{ uri: item.image }} style={styles.itemPreviewImage} resizeMode="cover" />}
                      <Text style={styles.itemCardTitle}>{item.name}</Text>
                      <Text style={styles.itemCardMeta}>₹{Number(item.price || 0).toFixed(0)} • {item.prepTime || "10 min"}</Text>
                      <Text style={styles.itemCardDesc}>{item.description || "Freshly launched by vendor."}</Text>

                      <View style={styles.inlineActions}>
                        <Pressable style={styles.actionGhostBtn} onPress={() => startEditItem(item)}>
                          <Text style={styles.actionGhostText}>Edit</Text>
                        </Pressable>
                        <Pressable style={styles.actionDangerBtn} onPress={() => onDeleteItem?.(item.id)}>
                          <Text style={styles.actionDangerText}>Delete</Text>
                        </Pressable>
                      </View>
                    </>
                  )}
                </View>
              );
            })
          )}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{orders.length}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{inr(totalRevenue)}</Text>
            <Text style={styles.statLabel}>Total Revenue</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {orders.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No orders yet</Text>
              <Text style={styles.emptyText}>When customers place orders, they will appear here with full item details.</Text>
            </View>
          ) : (
            orders.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <Text style={styles.orderId}>Order ID: {order.id}</Text>
                <Text style={styles.orderMeta}>Customer: {order.customerName || "Unknown"}</Text>
                <Text style={styles.orderMeta}>Email: {order.customerEmail || "N/A"}</Text>
                <Text style={styles.orderMeta}>Time: {order.at}</Text>
                <Text style={styles.orderMeta}>Payment: {order.paymentMethod || "N/A"}</Text>
                <Text style={styles.orderMetaStrong}>Items: {order.totalItems || 0} • Total: {inr(order.total)}</Text>

                <View style={styles.itemList}>
                  {(order.items || []).map((item, index) => (
                    <View key={`${order.id}-${item.id}-${index}`} style={styles.itemRow}>
                      {!!item.image ? (
                        <Image source={typeof item.image === "number" ? item.image : { uri: item.image }} style={styles.itemImage} resizeMode="cover" />
                      ) : (
                        <View style={styles.itemImageFallback}>
                          <Ionicons name="restaurant-outline" size={14} color="#d95022" />
                        </View>
                      )}

                      <View style={{ flex: 1 }}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemMeta}>Qty: {item.quantity || 1}</Text>
                      </View>
                      <Text style={styles.itemPrice}>{inr(item.price)}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingTop: 18 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerTitle: { color: "#101828", fontSize: 24, fontWeight: "800" },
  headerSub: { color: "#667085", fontSize: 13.5, marginTop: 2 },
  headerActions: { flexDirection: "row", gap: 8, marginTop: 4 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ffd9c9",
    backgroundColor: "#fff3ec",
  },
  actionText: { color: "#d95022", fontWeight: "700", fontSize: 12.5 },
  logoutRow: {
    marginHorizontal: 16,
    marginBottom: 8,
    alignItems: "flex-end",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#d95022",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  logoutText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  noteWrap: {
    marginHorizontal: 14,
    marginBottom: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#b2ddff",
    backgroundColor: "#eff8ff",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  noteText: { color: "#175cd3", fontSize: 12.5, fontWeight: "700" },
  panelCard: {
    marginHorizontal: 14,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#edf0f5",
    backgroundColor: "#fff",
    padding: 12,
  },
  panelTitle: { color: "#101828", fontSize: 16, fontWeight: "800" },
  panelSub: { color: "#667085", marginTop: 4, marginBottom: 8, lineHeight: 18, fontSize: 12.5 },
  input: {
    borderWidth: 1,
    borderColor: "#e4e7ec",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 9,
    marginTop: 8,
    fontSize: 13,
    color: "#101828",
  },
  inputMulti: { minHeight: 72, textAlignVertical: "top" },
  launchBtn: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#d95022",
    borderRadius: 10,
    paddingVertical: 10,
  },
  launchBtnInline: {
    flex: 1,
    marginTop: 0,
  },
  launchBtnText: { color: "#fff", fontWeight: "800", fontSize: 13.5 },
  publishNote: { marginTop: 8, color: "#175cd3", fontWeight: "700", fontSize: 12.5 },
  emptyInline: { color: "#667085", fontSize: 12.5, fontWeight: "600", marginTop: 6 },
  launchedItemCard: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#edf0f5",
    borderRadius: 10,
    backgroundColor: "#fcfcfd",
    padding: 10,
  },
  itemCardTitle: { color: "#101828", fontSize: 14.5, fontWeight: "800" },
  itemCardMeta: { color: "#d95022", fontSize: 12.5, fontWeight: "800", marginTop: 2 },
  itemCardDesc: { color: "#667085", fontSize: 12.5, marginTop: 4, lineHeight: 18 },
  itemPreviewImage: {
    width: "100%",
    height: 130,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#edf0f5",
  },
  inlineActions: { flexDirection: "row", gap: 8, marginTop: 8 },
  actionSolidBtn: {
    backgroundColor: "#d95022",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionSolidText: { color: "#fff", fontWeight: "800", fontSize: 12.5 },
  actionGhostBtn: {
    borderWidth: 1,
    borderColor: "#d0d5dd",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionGhostText: { color: "#344054", fontWeight: "700", fontSize: 12.5 },
  actionDangerBtn: {
    borderWidth: 1,
    borderColor: "#fda29b",
    backgroundColor: "#fff1f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionDangerText: { color: "#b42318", fontWeight: "800", fontSize: 12.5 },
  statsRow: { flexDirection: "row", gap: 8, paddingHorizontal: 14, marginBottom: 8 },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#edf0f5",
    padding: 12,
  },
  statValue: { color: "#d95022", fontWeight: "800", fontSize: 18 },
  statLabel: { color: "#667085", marginTop: 2, fontSize: 12.5, fontWeight: "600" },
  content: { paddingHorizontal: 14, paddingBottom: 20 },
  emptyCard: {
    marginTop: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#edf0f5",
    backgroundColor: "#fff",
    padding: 14,
  },
  emptyTitle: { color: "#101828", fontSize: 17, fontWeight: "800" },
  emptyText: { color: "#667085", marginTop: 4, lineHeight: 20 },
  orderCard: {
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#edf0f5",
    backgroundColor: "#fff",
    padding: 12,
  },
  orderId: { color: "#101828", fontSize: 14.5, fontWeight: "800" },
  orderMeta: { color: "#667085", marginTop: 3, fontSize: 12.5, fontWeight: "600" },
  orderMetaStrong: { color: "#101828", marginTop: 6, fontSize: 13.5, fontWeight: "800" },
  itemList: { marginTop: 10, gap: 8 },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#edf0f5",
    borderRadius: 10,
    padding: 8,
    backgroundColor: "#fcfcfd",
  },
  itemImage: { width: 40, height: 40, borderRadius: 8 },
  itemImageFallback: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffd9c9",
    backgroundColor: "#fff3ec",
    alignItems: "center",
    justifyContent: "center",
  },
  itemName: { color: "#101828", fontSize: 13.5, fontWeight: "700" },
  itemMeta: { color: "#667085", fontSize: 12, fontWeight: "600", marginTop: 1 },
  itemPrice: { color: "#d95022", fontSize: 13, fontWeight: "800" },
});
