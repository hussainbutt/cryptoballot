import { Link, router } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

const LoginPage = () => {
  const [cnic, setCnic] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (cnic.trim() === "" || password.trim() === "") {
      Alert.alert("Error", "Please enter CNIC and password");
    } else {
    }
  };

  return (
    <View className="flex-1 bg-white items-center justify-center px-8">
      {/* App Title */}
      <Text className="text-4xl font-extrabold mb-4 text-blue-600">
        Crypto Ballott
      </Text>
      <Text className="text-lg text-gray-500 mb-10">
        Secure your vote with confidence
      </Text>

      {/* Form */}
      <View className="w-full">
        <TextInput
          className="w-full h-14 bg-gray-100 rounded-2xl px-4 mb-5 text-base  placeholder:opacity-60"
          placeholder="Enter CNIC without dashes"
          value={cnic}
          onChangeText={(text) => setCnic(text.replace(/[^0-9]/g, ""))}
          maxLength={14}
          keyboardType="number-pad"
        />

        <TextInput
          className="w-full h-14 bg-gray-100 rounded-2xl px-4 mb-6 text-base  placeholder:opacity-60"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Button */}
        <TouchableOpacity
          className="w-full bg-blue-500 p-4 rounded-2xl items-center shadow-md active:bg-blue-600"
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-semibold">Login</Text>
        </TouchableOpacity>

        {/* Signup link */}
        <View className="flex-row justify-center mt-6">
          <Text className="mt-4">
            Not already registered?{" "}
            <Text
              onPress={() => router.push("/(auth)/signup")}
              className="mt-4 text-blue-700 font-semibold"
            >
              Sign up
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default LoginPage;
