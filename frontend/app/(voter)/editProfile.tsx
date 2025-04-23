import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const EditProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [nationalHalqa, setNationalHalqa] = useState<string>("");
  const [provincialHalqa, setProvincialHalqa] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const userObj = JSON.parse(userData);
        setUser(userObj);
        setName(userObj.name || "");
        setEmail(userObj.email || "");
        setNationalHalqa(userObj.halqa?.national || "");
        setProvincialHalqa(userObj.halqa?.provincial || "");
      }
    };

    fetchUser();
  }, []);

  const handleSaveChanges = async () => {
    if (isLoading) return; // Prevent multiple submissions

    setIsLoading(true);
    const updatedUser = {
      name,
      email,
      halqa: { national: nationalHalqa, provincial: provincialHalqa },
    };

    try {
      // Assuming you have an endpoint to update the user's profile (replace URL accordingly)
      const res = await fetch(
        `http://192.168.180.184:5000/api/auth/update/${user.cnic}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );

      const data = await res.json();

      if (res.ok) {
        // Save updated user data back to AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        Alert.alert(
          "Profile Updated",
          "Your profile has been updated successfully."
        );
        router.push("/profile"); // Redirect to profile page
      } else {
        Alert.alert("Error", data.message || "Could not update profile.");
      }
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setIsLoading(false);
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
    <View className="flex-1 bg-white px-6 pt-16">
      <Text className="text-3xl font-bold text-blue-700 text-center mb-6">
        Edit Profile
      </Text>

      <View className="space-y-4">
        <TextInput
          className="bg-gray-200 p-4 rounded-xl"
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          className="bg-gray-200 p-4 rounded-xl"
          placeholder="Email (Optional)"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          className="bg-gray-200 p-4 rounded-xl"
          placeholder="National Halqa"
          value={nationalHalqa}
          onChangeText={setNationalHalqa}
        />

        <TextInput
          className="bg-gray-200 p-4 rounded-xl"
          placeholder="Provincial Halqa"
          value={provincialHalqa}
          onChangeText={setProvincialHalqa}
        />

        <TouchableOpacity
          className="bg-blue-600 py-3 rounded-xl items-center"
          onPress={handleSaveChanges}
          disabled={isLoading}
        >
          {isLoading ? (
            <Ionicons name="reload-outline" size={24} color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg">
              Save Changes
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditProfile;
