import { Link, router } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

const SignupPage = () => {
  const [cnic, setCnic] = useState("");
  const [phone, setPhone] = useState("+92");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    if (cnic.trim() === "" || phone.trim() === "" || password.trim() === "") {
      Alert.alert("Error", "Please fill in all fields");
    } else {
      Alert.alert("Success", `Signup attempted, CNIC: ${cnic}`);
      // API call here
    }
  };

  return (
    <View className="flex-1 bg-white items-center justify-center px-8">
      {/* App Title */}
      <Text className="text-4xl font-extrabold mb-4 text-blue-600">
        Crypto Ballot
      </Text>
      <Text className="text-lg text-gray-500 mb-10">
        Join the secure voting revolution
      </Text>

      {/* Form */}
      <View className="w-full">
        <TextInput
          className="w-full h-14 bg-gray-100 rounded-2xl px-4 mb-4 text-base placeholder:opacity-60"
          placeholder="Enter CNIC without dashes"
          value={cnic}
          onChangeText={setCnic}
          keyboardType="number-pad"
        />

        <TextInput
          className="w-full h-14 bg-gray-100 rounded-2xl px-4 mb-4 text-base  placeholder:opacity-60"
          placeholder="Enter Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <TextInput
          className="w-full h-14 bg-gray-100 rounded-2xl px-4 mb-6 text-base  placeholder:opacity-60"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Signup Button */}
        <TouchableOpacity
          className="w-full bg-blue-500 p-4 rounded-2xl items-center shadow-md active:bg-blue-600"
          onPress={handleSignup}
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-semibold">Sign Up</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View className="flex-row justify-center mt-6">
          <Text className="mt-4">
            Already registered?{" "}
            <Text
              onPress={() => router.push("/(auth)/login")}
              className="mt-4 text-blue-700 font-semibold"
            >
              Log in
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SignupPage;
