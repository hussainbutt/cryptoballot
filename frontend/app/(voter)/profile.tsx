import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { handleLogout } from "../../utils/jwtController";
import { Ionicons } from "@expo/vector-icons";

const UserProfile = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };

    fetchUser();
  }, []);

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await fetch(
                `http://192.168.18.82:5000/api/auth/delete/${user?.cnic}`,
                {
                  method: "DELETE",
                }
              );

              const data = await res.json();

              if (res.ok) {
                Alert.alert("Deleted", data.message);
                await handleLogout();
              } else {
                Alert.alert(
                  "Error",
                  data.message || "Could not delete account"
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

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-16">
      <Text className="text-3xl font-bold text-blue-700 text-center mb-6">
        My Profile
      </Text>

      <View className="bg-gray-100 rounded-xl p-6 mb-8">
        <Text className="text-lg font-semibold text-gray-800 mb-2">
          Name: <Text className="font-normal">{user.name}</Text>
        </Text>

        <Text className="text-lg font-semibold text-gray-800 mb-2">
          CNIC: <Text className="font-normal">{user.cnic}</Text>
        </Text>

        {user.email && (
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Email: <Text className="font-normal">{user.email}</Text>
          </Text>
        )}

        <Text className="text-lg font-semibold text-gray-800 mb-2">
          National Halqa:{" "}
          <Text className="font-normal">{user.nationalHalqa || "N/A"}</Text>
        </Text>

        <Text className="text-lg font-semibold text-gray-800">
          Provincial Halqa:{" "}
          <Text className="font-normal">{user.provincialHalqa || "N/A"}</Text>
        </Text>
      </View>

      <View className="space-y-4">
        <TouchableOpacity
          className="bg-blue-600 py-3 rounded-xl items-center"
          onPress={() =>
            Alert.alert("Coming Soon", "Edit profile coming soon!")
          }
        >
          <Ionicons name="create-outline" size={20} color="white" />
          <Text className="text-white font-semibold text-lg">Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-red-500 py-3 rounded-xl items-center"
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="white" />
          <Text className="text-white font-semibold text-lg">Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-gray-800 py-3 rounded-xl items-center"
          onPress={handleDeleteAccount}
        >
          <Ionicons name="trash-outline" size={20} color="white" />
          <Text className="text-white font-semibold text-lg">
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default UserProfile;
