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
            } catch (error: any) {
              Alert.alert("Error", error.message);
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
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 pt-16 pb-8">
        <Text className="text-3xl font-bold text-blue-700 text-center mb-10">
          My Profile
        </Text>

        <View className="bg-gray-100 rounded-xl p-8 mb-10 shadow-sm">
          <View className="space-y-6">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-4">
                <Ionicons name="person-outline" size={24} color="#4B5563" />
              </View>
              <View>
                <Text className="text-lg font-semibold text-gray-800">Name</Text>
                <Text className="text-gray-600 mt-1">{user.name}</Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-4">
                <Ionicons name="card-outline" size={24} color="#4B5563" />
              </View>
              <View>
                <Text className="text-lg font-semibold text-gray-800">CNIC</Text>
                <Text className="text-gray-600 mt-1">{user.cnic}</Text>
              </View>
            </View>

            {user.email && (
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-4">
                  <Ionicons name="mail-outline" size={24} color="#4B5563" />
                </View>
                <View>
                  <Text className="text-lg font-semibold text-gray-800">Email</Text>
                  <Text className="text-gray-600 mt-1">{user.email}</Text>
                </View>
              </View>
            )}

            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-4">
                <Ionicons name="location-outline" size={24} color="#4B5563" />
              </View>
              <View>
                <Text className="text-lg font-semibold text-gray-800">National Halqa</Text>
                <Text className="text-gray-600 mt-1">{user.nationalHalqa || "N/A"}</Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-4">
                <Ionicons name="location-outline" size={24} color="#4B5563" />
              </View>
              <View>
                <Text className="text-lg font-semibold text-gray-800">Provincial Halqa</Text>
                <Text className="text-gray-600 mt-1">{user.provincialHalqa || "N/A"}</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="gap-y-3">
          <TouchableOpacity
            className="bg-blue-600 py-4 rounded-xl flex-row items-center justify-center space-x-2"
            onPress={() => router.push("/(voter)/upcoming")}
          >
            <Ionicons name="calendar-outline" size={20} color="white" />
            <Text className="text-white font-semibold text-lg">Upcoming Elections</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-blue-600 py-4 rounded-xl flex-row items-center justify-center space-x-2"
            onPress={() => router.push("/(voter)/editProfile")}
          >
            <Ionicons name="create-outline" size={20} color="white" />
            <Text className="text-white font-semibold text-lg">Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-500 py-4 rounded-xl flex-row items-center justify-center space-x-2"
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text className="text-white font-semibold text-lg">Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gray-800 py-4 rounded-xl flex-row items-center justify-center space-x-2"
            onPress={handleDeleteAccount}
          >
            <Ionicons name="trash-outline" size={20} color="white" />
            <Text className="text-white font-semibold text-lg">
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default UserProfile;
