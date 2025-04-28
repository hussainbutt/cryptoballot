// app/(admin)/candidates/[id]/edit.tsx
import { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";

export default function EditCandidateScreen() {
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const { query } = useRouter();
  const { id } = query;

  const fetchCandidate = async () => {
    try {
      const res = await fetch(`http://192.168.1.13:5000/api/candidates/${id}`);
      const data = await res.json();
      setCandidate(data);
    } catch (err) {
      console.error("Error fetching candidate details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCandidate();
    }
  }, [id]);

  const handleSubmit = async () => {
    if (
      !candidate.name ||
      !candidate.cnic ||
      !candidate.naHalqa ||
      !candidate.ppHalqa
    ) {
      return Alert.alert("Validation", "All fields are required");
    }

    try {
      const res = await fetch(`http://192.168.1.13:5000/api/candidates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(candidate),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Success", "Candidate updated");
        router.push("/(admin)/candidates");
      } else {
        Alert.alert("Error", data.message || "Failed to update candidate");
      }
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#3B82F6" />;
  }

  return (
    <View className="flex-1 bg-white p-4">
      <TextInput
        value={candidate.name}
        onChangeText={(text) => setCandidate({ ...candidate, name: text })}
        className="bg-gray-100 rounded-md px-4 py-3 mb-4"
        placeholder="Candidate Name"
      />
      <TextInput
        value={candidate.cnic}
        onChangeText={(text) => setCandidate({ ...candidate, cnic: text })}
        className="bg-gray-100 rounded-md px-4 py-3 mb-4"
        placeholder="CNIC"
      />
      <TextInput
        value={candidate.naHalqa}
        onChangeText={(text) => setCandidate({ ...candidate, naHalqa: text })}
        className="bg-gray-100 rounded-md px-4 py-3 mb-4"
        placeholder="NA Halqa"
      />
      <TextInput
        value={candidate.ppHalqa}
        onChangeText={(text) => setCandidate({ ...candidate, ppHalqa: text })}
        className="bg-gray-100 rounded-md px-4 py-3 mb-4"
        placeholder="PP Halqa"
      />
      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-blue-600 py-4 rounded-2xl"
      >
        <Text className="text-white font-semibold text-center text-lg">
          Update Candidate
        </Text>
      </TouchableOpacity>
    </View>
  );
}
