import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const EditProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nationalHalqa: "",
    provincialHalqa: "",
  });
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setFormData({
          nationalHalqa: parsedUser.nationalHalqa || "",
          provincialHalqa: parsedUser.provincialHalqa || "",
        });
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://192.168.18.82:5000/api/auth/update/${user.cnic}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...user,
            ...formData
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        // Update local storage
        const updatedUser = { ...user, ...formData };
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        Alert.alert("Success", "Profile updated successfully");
        router.back();
      } else {
        Alert.alert("Error", data.message || "Failed to update profile");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
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
      <Text className="text-3xl font-bold text-blue-700 text-center mb-8">
        Edit Profile
      </Text>

      <View className="space-y-6">
        <View>
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            National Halqa
          </Text>
        <TextInput
            className="bg-gray-100 p-4 rounded-xl text-gray-800"
            value={formData.nationalHalqa}
            onChangeText={(text) =>
              setFormData({ ...formData, nationalHalqa: text })
            }
            placeholder="Enter your national halqa"
          />
        </View>

        <View>
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Provincial Halqa
          </Text>
        <TextInput
            className="bg-gray-100 p-4 rounded-xl text-gray-800"
            value={formData.provincialHalqa}
            onChangeText={(text) =>
              setFormData({ ...formData, provincialHalqa: text })
            }
            placeholder="Enter your provincial halqa"
          />
        </View>

        <View className="space-y-4 pt-4">
        <TouchableOpacity
            className="my-2 bg-blue-600 py-4 rounded-xl flex-row items-center justify-center space-x-2"
            onPress={handleUpdate}
            disabled={loading}
        >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="save-outline" className="pr-2" size={20} color="white" />
            <Text className="text-white font-semibold text-lg">
              Save Changes
            </Text>
              </>
          )}
        </TouchableOpacity>

          <TouchableOpacity
            className="bg-gray-500 py-4 rounded-xl flex-row items-center justify-center space-x-2"
            onPress={() => router.back()}
            disabled={loading}
          >
            <Ionicons name="arrow-back-outline" size={20} color="white" />
            <Text className="text-white font-semibold text-lg">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default EditProfile;
