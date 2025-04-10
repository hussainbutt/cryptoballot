import React, { useRef, useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { auth } from "../../firebase";
import { signInWithPhoneNumber } from "firebase/auth";
import { router, useLocalSearchParams } from "expo-router";

export default function PhoneAuthScreen() {
  const { phone, cnic, password } = useLocalSearchParams();
  const recaptchaVerifier = useRef(null);
  const [code, setCode] = useState("");
  const [confirmation, setConfirmation] = useState<any>(null);

  const completePhone = phone;
  // Send OTP to the phone number
  const sendOTP = async () => {
    try {
      console.log("+" + typeof phone);
      console.log(cnic);

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        "+" + phone,
        recaptchaVerifier.current
      );
      setConfirmation(confirmationResult);
      Alert.alert("OTP sent");
    } catch (error: any) {
      Alert.alert("Error sending OTP", error.message);
    }
  };

  // Confirm the OTP entered by the user
  const confirmOTP = async () => {
    try {
      await confirmation.confirm(code);
      Alert.alert("Phone number verified");
      //backend call

      await registerUserWithBackend();
      //go back to prev screen
      router.back();
    } catch (error: any) {
      Alert.alert("Invalid OTP", error.message);
    }
  };
  const registerUserWithBackend = async () => {
    try {
      console.log(cnic + phone + password);
      const response = await fetch("http://192.168.1.10:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cnic,
          phone,
          password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("User registered successfully");
      } else {
        Alert.alert("Error registering user", result.message);
      }
    } catch (error) {
      Alert.alert("Error calling backend", error.message);
    }
  };

  return (
    <View className="flex-1 justify-center items-center px-5 bg-white">
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={auth.app.options}
      />

      {!confirmation ? (
        // OTP sending screen
        <View className="w-full p-5 justify-center items-center">
          <Text className="text-2xl font-bold mb-6 text-gray-800">
            Click when you're ready
          </Text>
          <TouchableOpacity
            className="bg-blue-500 py-4 w-full rounded-lg mt-6"
            onPress={sendOTP}
          >
            <Text className="text-white text-lg font-semibold text-center">
              Send OTP
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        // OTP input screen
        <View className="w-full p-5 justify-center items-center">
          <Text className="text-2xl font-bold mb-6 text-gray-800">
            Enter the OTP sent to your phone
          </Text>
          <TextInput
            placeholder="Enter OTP"
            className="w-full p-4 mb-4 border border-gray-300 rounded-lg text-lg text-gray-800"
            onChangeText={setCode}
            keyboardType="number-pad"
          />
          <TouchableOpacity
            className="bg-blue-500 py-4 w-full rounded-lg mt-6"
            onPress={confirmOTP}
          >
            <Text className="text-white text-lg font-semibold text-center">
              Verify OTP
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
