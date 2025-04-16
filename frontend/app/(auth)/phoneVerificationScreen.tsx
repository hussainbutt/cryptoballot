import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { firebaseConfig } from "../../firebase";
import {
  getAuth,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { app } from "../../firebase"; // initializeApp firebase

const auth = getAuth(app);

const PhoneVerificationScreen = ({}) => {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const recaptchaVerifier = useRef(null);

  const sendVerification = async () => {
    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const id = await phoneProvider.verifyPhoneNumber(
        "+92" + phone,
        recaptchaVerifier.current
      );
      setVerificationId(id);
      Alert.alert("OTP Sent", "Check your phone.");
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const confirmCode = async () => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      await signInWithCredential(auth, credential);
      Alert.alert("Verified", "Phone number verified!");
      navigation.navigate("ResetPasswordScreen", { phone });
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View className="flex-1 justify-center items-center px-6 bg-white">
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />
      <Text className="text-xl font-bold mb-4">Verify Phone</Text>

      <TextInput
        placeholder="Enter Phone (without +92)"
        onChangeText={setPhone}
        keyboardType="phone-pad"
        className="bg-gray-100 px-4 h-12 w-full mb-3 rounded-xl"
      />

      <TouchableOpacity
        onPress={sendVerification}
        className="bg-blue-500 w-full p-3 rounded-xl mb-4"
      >
        <Text className="text-white text-center">Send OTP</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Enter OTP"
        onChangeText={setCode}
        keyboardType="number-pad"
        className="bg-gray-100 px-4 h-12 w-full mb-3 rounded-xl"
      />

      <TouchableOpacity
        onPress={confirmCode}
        className="bg-green-600 w-full p-3 rounded-xl"
      >
        <Text className="text-white text-center">Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PhoneVerificationScreen;
