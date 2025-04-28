import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons"; // To use the eye icon
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

const LoginPage = () => {
  const [cnic, setCnic] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (cnic.trim() === "" || password.trim() === "") {
      Alert.alert("Error", "Please enter CNIC and password");
    } else {
      try {
        console.log("handle login called");

        const response = await fetch(
          "http://192.168.1.13:5000/api/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cnic,
              password,
            }),
          }
        );

        const data = await response.json(); // Wait for the response to be parsed into JSON.

        if (response.ok) {
          const success = await AsyncStorage.setItem("authToken", data.token);
          console.log("Token Saved?", success);
          const savedToken = await AsyncStorage.getItem("authToken");
          console.log("Saved token:", savedToken);

          await AsyncStorage.setItem("user", JSON.stringify(data.user));

          Alert.alert("Success", "Logged in successfully!");

          if (data.user.role === "admin") router.replace("/(admin)/dashboard");
          else router.replace("/(voter)/home");
        } else {
          // If response is not okay, show the error message
          Alert.alert("Login failed", data.message);
        }
      } catch (error) {
        // Catch any other errors (like network issues) and display an alert
        Alert.alert("Error while logging in", error.message);
      }
    }
  };

  return (
    <View className="flex-1 bg-white items-center justify-center px-8">
      {/* App Title */}
      <Text className="text-4xl font-extrabold mb-4 text-blue-600">
        Crypto Ballot
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

        <View className="relative">
          <TextInput
            className="w-full h-14 bg-gray-100 rounded-2xl px-4 mb-6 text-base placeholder:opacity-60"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity
            className="absolute right-4 top-4"
            onPress={() => setPasswordVisible(!passwordVisible)} // Toggle password visibility
          >
            <Ionicons
              name={passwordVisible ? "eye-off" : "eye"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (!cnic) {
              Alert.alert("Error", "Please enter your CNIC first.");
            } else {
              router.push({
                pathname: "/(auth)/resetPassword",
                params: { cnic },
              });
            }
          }}
          className="mb-5"
        >
          <Text className="text-blue-600">Forgot password?</Text>
        </TouchableOpacity>

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
