import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { handleLogout } from "../../utils/jwtController";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const [username, setUsername] = useState("");
  const [cnic, setCnic] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setUsername(user?.name || "User");
        setCnic(user?.cnic || "");
      }
    };

    fetchUser();
  }, []);

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await fetch(
                `http://192.168.1.3:5000/api/auth/delete/${cnic}`,
                {
                  method: "DELETE",
                }
              );

              const data = await res.json();

              if (res.ok) {
                Alert.alert("Account Deleted", data.message);
                await handleLogout();
              } else {
                Alert.alert(
                  "Error",
                  data.message || "Failed to delete account"
                );
              }
            } catch (err) {
              Alert.alert("Error", err.message);
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 items-center justify-center bg-white px-4">
      <Text className="text-2xl font-bold mb-6">
        Welcome to the Home Page! {username}
      </Text>

      <Pressable
        className="bg-red-500 px-6 py-3 rounded-xl mb-4"
        onPress={handleLogout}
      >
        <Text className="text-white text-lg font-semibold">Logout</Text>
      </Pressable>

      <Pressable
        className="bg-gray-800 px-6 py-3 rounded-xl"
        onPress={handleDeleteAccount}
      >
        <Text className="text-white text-lg font-semibold">Delete Account</Text>
      </Pressable>
    </View>
  );
};

export default Home;
