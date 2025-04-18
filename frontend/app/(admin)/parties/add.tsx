import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

export default function AddPartyScreen() {
  const [name, setName] = useState("");
  const [leader, setLeader] = useState("");
  const [symbol, setSymbol] = useState<any>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setSymbol(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!name || !leader || !symbol) {
      return Alert.alert("Validation", "All fields are required");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("leader", leader);
    formData.append("symbol", {
      uri: symbol.uri,
      name: "symbol.jpg",
      type: "image/jpeg",
    });

    try {
      const res = await fetch("http://192.168.1.3:5000/api/parties", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Success", "Party created");
        router.push("/(admin)/parties");
      } else {
        Alert.alert("Error", data.message || "Failed to create party");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <Text className="text-3xl font-extrabold text-blue-600 mb-6 text-center">
            Add Party
          </Text>

          <Text className="text-base font-medium text-gray-700 mb-1">
            Party Name
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter party name"
            className="w-full h-14 bg-gray-100 rounded-2xl px-4 mb-4 text-base placeholder:text-gray-500"
          />

          <Text className="text-base font-medium text-gray-700 mb-1">
            Party Leader
          </Text>
          <TextInput
            value={leader}
            onChangeText={setLeader}
            placeholder="Enter leader name"
            className="w-full h-14 bg-gray-100 rounded-2xl px-4 mb-4 text-base placeholder:text-gray-500"
          />

          <TouchableOpacity
            onPress={pickImage}
            className="bg-gray-200 py-3 rounded-2xl mb-4 active:bg-gray-300"
            activeOpacity={0.8}
          >
            <Text className="text-center text-gray-700 font-medium">
              {symbol ? "Change Party Symbol" : "Pick Party Symbol"}
            </Text>
          </TouchableOpacity>

          {symbol && (
            <View className="items-center mb-6">
              <Image
                source={{ uri: symbol.uri }}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: "#E5E7EB", // gray-200
                }}
                resizeMode="contain"
              />
            </View>
          )}

          <TouchableOpacity
            onPress={handleSubmit}
            className="w-full bg-blue-500 p-4 rounded-2xl items-center shadow-md active:bg-blue-600"
            activeOpacity={0.8}
          >
            <Text className="text-white text-lg font-semibold">
              Create Party
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
