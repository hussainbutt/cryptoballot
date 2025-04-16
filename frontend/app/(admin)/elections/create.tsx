import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";

export default function CreateElectionScreen() {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [electionType, setElectionType] = useState("General");

  const handleSubmit = async () => {
    if (!title || !startTime || !endTime) {
      return Alert.alert("Validation", "All fields are required");
    }

    const electionData = {
      title,
      startTime,
      endTime,
      electionType,
    };

    try {
      const res = await fetch("http://192.168.1.9:5000/api/elections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(electionData),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Success", "Election created");
        router.push("/(admin)/elections");
      } else {
        Alert.alert("Error", data.message || "Failed to create election");
      }
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 15,
      }}
      className="flex-1 bg-white px-4"
    >
      <Text className="text-2xl font-bold text-center text-blue-600 mb-6">
        Create Election
      </Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Election Title"
        className="bg-gray-100 rounded-2xl px-4 py-3 mb-4"
      />

      <Text className="mb-1 text-gray-700 font-semibold">
        Start Time (YYYY-MM-DD HH:mm)
      </Text>
      <TextInput
        value={startTime}
        onChangeText={setStartTime}
        placeholder="Example: 2025-05-01 09:00"
        keyboardType="default"
        className="bg-gray-100 rounded-2xl px-4 py-3 mb-4"
      />

      <Text className="mb-1 text-gray-700 font-semibold">
        End Time (YYYY-MM-DD HH:mm)
      </Text>
      <TextInput
        value={endTime}
        onChangeText={setEndTime}
        placeholder="Example: 2025-05-01 17:00"
        keyboardType="default"
        className="bg-gray-100 rounded-2xl px-4 py-3 mb-4"
      />

      <Text className="mb-2 text-gray-700 font-semibold">Election Type</Text>
      <View className="bg-gray-100 rounded-2xl mb-6">
        <Picker
          selectedValue={electionType}
          onValueChange={(itemValue) => setElectionType(itemValue)}
        >
          <Picker.Item label="General" value="General" />
          <Picker.Item label="Provincial" value="Provincial" />
        </Picker>
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-blue-600 py-4 rounded-2xl"
      >
        <Text className="text-white font-semibold text-center text-lg">
          Create Election
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
