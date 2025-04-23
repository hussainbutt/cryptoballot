import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { handleLogout } from "../../utils/jwtController";

const VoterHome = () => {
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setUsername(user?.name || "Voter");
      }
    };
    fetchUser();
  }, []);

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-24">
      {/* Welcome Section */}
      <View className="mb-10">
        <Text className="text-3xl font-extrabold text-blue-700 text-center">
          Welcome, {username} 👋
        </Text>
        <Text className="text-lg text-gray-500 text-center mt-2">
          Ready to make your voice count?
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="space-y-6 flex-1 gap-10">
        <Pressable
          onPress={() => router.push("/(voter)/elections")}
          className="bg-blue-600 py-10 rounded-2xl flex-row items-center justify-center shadow-md"
        >
          <Ionicons name="copy" size={22} color="white" />
          <Text className="text-white text-lg ml-3 font-semibold">
            Ongoing Elections
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(voter)/history")}
          className="bg-indigo-600 py-10 rounded-2xl flex-row items-center justify-center shadow-md"
        >
          <Ionicons name="time-outline" size={22} color="white" />
          <Text className="text-white text-lg ml-3 font-semibold">
            View Voting History
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(voter)/profile")}
          className="bg-green-600 py-10 rounded-2xl flex-row items-center justify-center shadow-md"
        >
          <Ionicons name="person-outline" size={22} color="white" />
          <Text className="text-white text-lg ml-3 font-semibold">
            My Profile
          </Text>
        </Pressable>
      </View>

      {/* Logout */}
      <Pressable
        onPress={handleLogout}
        className="bg-red-500 py-4 rounded-xl flex-row items-center justify-center mt-16 shadow-sm"
      >
        <Ionicons name="log-out-outline" size={20} color="white" />
        <Text className="text-white text-base ml-2 font-medium">Logout</Text>
      </Pressable>
    </ScrollView>
  );
};

export default VoterHome;
