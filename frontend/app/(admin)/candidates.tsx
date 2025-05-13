// CandidatesScreen.tsx
import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import CandidateCard from "../../components/ui/CandidateCard"; // Import the new component

export default function CandidatesScreen() {
  const [candidates, setCandidates] = useState([]);
  const router = useRouter();

  const fetchCandidates = async () => {
    try {
      const res = await fetch("http://192.168.18.82:5000/api/candidates");
      const data = await res.json();
      setCandidates(data);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      const res = await fetch(
        `http://192.168.18.82:5000/api/candidates/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (res.ok) {
        Alert.alert("Success", `Candidate ${newStatus}`);
        fetchCandidates(); // Refresh list
      } else {
        const data = await res.json();
        Alert.alert("Error", data.message || "Failed to update status");
      }
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const deleteCandidate = (id: string) => {
    setCandidates((prevCandidates) =>
      prevCandidates.filter((candidate) => candidate._id !== id)
    );
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6 pt-20">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-3xl font-bold text-blue-600">Candidates</Text>

        <TouchableOpacity
          className="bg-green-600 px-4 py-2 rounded-lg"
          onPress={() => router.push("/candidate/add")}
        >
          <Text className="text-white font-semibold">+ Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={candidates}
        renderItem={({ item }) => (
          <CandidateCard
            candidate={item}
            toggleStatus={toggleStatus}
            deleteCandidate={deleteCandidate}
          />
        )}
        keyExtractor={(item) => item._id}
      />
    </ScrollView>
  );
}
