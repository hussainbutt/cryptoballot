import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import {
  getAuth,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { firebaseConfig } from "../../firebase"; // Make sure you export config

const ResetPasswordScreen = () => {
  const router = useRouter();
  const { cnic } = useLocalSearchParams();

  const recaptchaVerifier = useRef(null);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const sendOtp = async () => {
    if (!phone) return Alert.alert("Error", "Enter phone number");

    try {
      const auth = getAuth();
      const provider = new PhoneAuthProvider(auth);

      const verificationId = await provider.verifyPhoneNumber(
        "+" + phone,
        recaptchaVerifier.current
      );
      setVerificationId(verificationId);
      Alert.alert("OTP Sent", "Check your phone for the code.");
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const verifyOtp = async () => {
    if (!otp || !verificationId) return Alert.alert("Error", "Enter OTP");

    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const auth = getAuth();
      await signInWithCredential(auth, credential);

      setOtpVerified(true);
      Alert.alert("Success", "OTP verified. You can now reset your password.");
    } catch (err) {
      Alert.alert("Invalid OTP", err.message);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) return Alert.alert("Error", "Enter new password");

    try {
      const response = await fetch(
        `http://192.168.18.82:5000/api/auth/update/${cnic}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, newPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Password reset successfully");
        router.replace("/(auth)/login");
      } else {
        Alert.alert("Error", data.message || "Failed to reset password");
      }
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View className="flex-1 bg-white justify-center px-6">
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />

      <Text className="text-xl font-bold mb-4 text-center">Reset Password</Text>

      <TextInput
        placeholder="Enter Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        className="bg-gray-100 px-4 h-12 rounded-xl mb-3"
      />

      {!verificationId ? (
        <TouchableOpacity
          onPress={sendOtp}
          className="bg-blue-600 p-3 rounded-xl mb-4"
        >
          <Text className="text-white text-center">Send OTP</Text>
        </TouchableOpacity>
      ) : !otpVerified ? (
        <>
          <TextInput
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            className="bg-gray-100 px-4 h-12 rounded-xl mb-3"
          />
          <TouchableOpacity
            onPress={verifyOtp}
            className="bg-blue-600 p-3 rounded-xl mb-4"
          >
            <Text className="text-white text-center">Verify OTP</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            placeholder="Enter New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            className="bg-gray-100 px-4 h-12 rounded-xl mb-3"
          />
          <TouchableOpacity
            onPress={handleResetPassword}
            className="bg-blue-600 p-3 rounded-xl"
          >
            <Text className="text-white text-center font-semibold">
              Reset Password
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default ResetPasswordScreen;
