import React, { useRef, useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { auth } from "../../firebase";
import { signInWithPhoneNumber } from "firebase/auth";
import { router, useLocalSearchParams } from "expo-router";

export default function PhoneAuthScreen() {
  const { phone, cnic, password, ppHalqa, naHalqa } = useLocalSearchParams();

  const recaptchaVerifier = useRef(null);
  const [code, setCode] = useState("");
  const [confirmation, setConfirmation] = useState<any>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const sendOTP = async () => {
    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        "+" + phone,
        recaptchaVerifier.current
      );
      setConfirmation(confirmationResult);
      setIsOtpSent(true);
      Alert.alert("OTP sent");
    } catch (error: any) {
      Alert.alert("Error sending OTP", error.message);
    }
  };

  const confirmOTP = async () => {
    try {
      await confirmation.confirm(code);
      Alert.alert("Phone number verified");
      resetOTPProcess();
      await registerUserWithBackend();
      router.replace("/(auth)/login");
    } catch (error: any) {
      Alert.alert("Invalid OTP", error.message);
    }
  };

  const resetOTPProcess = () => {
    setCode("");
    setIsOtpSent(false);
    setConfirmation(null);
  };

  const registerUserWithBackend = async () => {
    try {
      const response = await fetch(
        "http://192.168.180.184:5000/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cnic,
            phone,
            password,
            provincialHalqa: ppHalqa,
            nationalHalqa: naHalqa,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        Alert.alert("User registered successfully");
      } else {
        Alert.alert("Error registering user", result.message);
      }
    } catch (error: any) {
      Alert.alert("Error calling backend", error.message);
    }
  };

  return (
    <View className="flex-1 justify-center items-center px-6 bg-white">
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={auth.app.options}
      />

      {!confirmation ? (
        <View className="w-full items-center">
          <Text className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Tap the button to receive OTP
          </Text>
          <TouchableOpacity
            onPress={sendOTP}
            className="bg-blue-600 w-full py-4 rounded-2xl shadow-md"
          >
            <Text className="text-white text-lg font-semibold text-center">
              Send OTP
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="w-full items-center">
          <Text className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Enter OTP
          </Text>
          <TextInput
            placeholder="123456"
            keyboardType="number-pad"
            onChangeText={setCode}
            className="w-full px-4 py-3 mb-4 text-lg border border-gray-300 rounded-xl text-gray-900 bg-white"
          />
          <TouchableOpacity
            onPress={confirmOTP}
            className="bg-green-600 w-full py-4 rounded-2xl shadow-md"
          >
            <Text className="text-white text-lg font-semibold text-center">
              Verify OTP
            </Text>
          </TouchableOpacity>

          {isOtpSent && (
            <TouchableOpacity onPress={resetOTPProcess} className="mt-4">
              <Text className="text-blue-600 text-base font-medium underline">
                Send Again
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
