import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NationalHalqaPicker from "@/components/ui/NationalHalqaPicker";
import ProvincialHalqaPicker from "@/components/ui/ProvincialHalqaPicker";

type ProvinceCode = "PP" | "PS" | "PK" | "PB" | null;

const SignupPage = () => {
  const [cnic, setCnic] = useState("");
  const [phone, setPhone] = useState("92");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [province, setProvince] = useState<ProvinceCode>(null);
  const [ppHalqa, setPPHalqa] = useState("");
  const [naHalqa, setNAHalqa] = useState("");

  const handleSignup = () => {
    if (
      cnic.trim() === "" ||
      phone.trim() === "" ||
      password.trim() === "" ||
      !province ||
      !ppHalqa ||
      !naHalqa
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const phoneString = String(phone);
    router.push(
      `/(auth)/phoneAuthScreen?phone=${phoneString}&cnic=${cnic}&password=${password}&ppHalqa=${ppHalqa}&naHalqa=${naHalqa}`
    );
  };

  return (
    <ScrollView className="flex-1 bg-white px-8 pt-20">
      <View className="items-center">
        <Text className="text-4xl font-extrabold mb-2 text-blue-600">
          Crypto Ballot
        </Text>
        <Text className="text-lg text-gray-500 mb-8">
          Join the secure voting revolution
        </Text>
      </View>

      <View className="w-full">
        <TextInput
          className="w-full h-14 bg-gray-100 rounded-2xl px-4 mb-4 text-base placeholder:text-gray-500"
          placeholder="Enter CNIC without dashes"
          value={cnic}
          onChangeText={setCnic}
          keyboardType="number-pad"
        />

        <TextInput
          className="w-full h-14 bg-gray-100 rounded-2xl px-4 mb-4 text-base placeholder:text-gray-500"
          placeholder="Enter Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        {/* Password Field */}
        <View className="relative">
          <TextInput
            className="w-full h-14 bg-gray-100 rounded-2xl px-4 mb-4 text-base placeholder:text-gray-500"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity
            className="absolute right-4 top-4"
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Ionicons
              name={passwordVisible ? "eye-off" : "eye"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        {/* Provincial Halqa Picker */}
        <ProvincialHalqaPicker
          province={province}
          setProvince={setProvince}
          value={ppHalqa}
          onChange={setPPHalqa}
        />

        {/* National Halqa Picker */}
        <NationalHalqaPicker value={naHalqa} onChange={setNAHalqa} />

        {/* Submit Button */}
        <TouchableOpacity
          className="w-full bg-blue-500 p-4 rounded-2xl items-center shadow-md active:bg-blue-600"
          onPress={handleSignup}
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-semibold">Sign Up</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text>
            Already registered?{" "}
            <Text
              onPress={() => router.push("/(auth)/login")}
              className="text-blue-700 font-semibold"
            >
              Log in
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignupPage;
