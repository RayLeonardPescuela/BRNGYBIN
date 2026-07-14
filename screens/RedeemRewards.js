import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { db } from "../config/firebase";
import { useUser } from "../config/UserContext";

export default function RedeemRewards({ navigation }) {
  const { userData, refreshUserData } = useUser();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const snapshot = await db.collection("rewardItems").get();
      const itemList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(itemList);
    } catch (error) {
      console.log("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const redeemItem = async (item) => {
    const userPoints = userData?.points || 0;

    if (userPoints < item.points) {
      Alert.alert("Not Enough Points", `You need ${item.points - userPoints} more points to redeem this item.`);
      return;
    }

    if (item.stock <= 0) {
      Alert.alert("Out of Stock", "This item is currently out of stock.");
      return;
    }

    Alert.alert(
      "Confirm Redemption",
      `Redeem "${item.name}" for ${item.points} points?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Redeem",
          onPress: async () => {
            setRedeeming(item.id);
            try {
              // Deduct points
              await db.collection("users").doc(userData.uid || useUser().user.uid).update({
                points: userPoints - item.points,
              });

              // Decrease stock
              await db.collection("rewardItems").doc(item.id).update({
                stock: item.stock - 1,
              });

              // Save redemption history
              await db.collection("redemptions").add({
                userId: userData.uid || useUser().user.uid,
                userName: userData.name,
                itemId: item.id,
                itemName: item.name,
                pointsSpent: item.points,
                createdAt: new Date(),
              });

              await refreshUserData();
              fetchItems();

              Alert.alert("Success!", `You redeemed "${item.name}"!`);
            } catch (error) {
              Alert.alert("Error", "Failed to redeem item.");
              console.log(error);
            } finally {
              setRedeeming(null);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const canRedeem = (userData?.points || 0) >= item.points && item.stock > 0;

    return (
      <View style={styles.itemCard}>
        <View style={styles.itemIcon}>
          <MaterialCommunityIcons name="gift" size={30} color="#FFF" />
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDesc}>{item.description || "No description"}</Text>
          <View style={styles.itemMeta}>
            <Text style={styles.itemPoints}>{item.points} pts</Text>
            <Text style={[styles.itemStock, item.stock <= 0 && styles.outOfStock]}>
              {item.stock > 0 ? `${item.stock} left` : "Out of stock"}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.redeemBtn, !canRedeem && styles.redeemBtnDisabled]}
          onPress={() => redeemItem(item)}
          disabled={!canRedeem || redeeming === item.id}
        >
          {redeeming === item.id ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.redeemBtnText}>Redeem</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-double-left" size={35} color="#4A90E2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Redeem Rewards</Text>
      </View>
      <View style={styles.divider} />

      {/* Points Balance */}
      <View style={styles.pointsBanner}>
        <MaterialCommunityIcons name="star-circle" size={30} color="#FFD700" />
        <Text style={styles.pointsText}>{userData?.points || 0} Points Available</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#6B8E4E" />
        </View>
      ) : items.length === 0 ? (
        <View style={styles.center}>
          <MaterialCommunityIcons name="gift-outline" size={60} color="#999" />
          <Text style={styles.emptyText}>No rewards available yet</Text>
          <Text style={styles.emptySubtext}>Check back later!</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C5D8A4",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: "serif",
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#000",
    marginHorizontal: 20,
    marginBottom: 15,
  },
  pointsBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3E5132",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    gap: 10,
  },
  pointsText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "serif",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: "serif",
    color: "#666",
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: "serif",
    color: "#999",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  itemIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#6B8E4E",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "serif",
  },
  itemDesc: {
    fontSize: 13,
    color: "#666",
    fontFamily: "serif",
    marginTop: 2,
  },
  itemMeta: {
    flexDirection: "row",
    gap: 15,
    marginTop: 5,
  },
  itemPoints: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6B8E4E",
    fontFamily: "serif",
  },
  itemStock: {
    fontSize: 13,
    color: "#999",
    fontFamily: "serif",
  },
  outOfStock: {
    color: "#E57373",
  },
  redeemBtn: {
    backgroundColor: "#6B8E4E",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  redeemBtnDisabled: {
    backgroundColor: "#CCC",
  },
  redeemBtnText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "serif",
  },
});
