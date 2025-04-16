import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import CandidateCard from "@/components/ui/CandidateCard"; // Import the CandidateCard

export default function CandidatesScreen() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCandidates = async () => {
    try {
      const res = await fetch("http://192.168.1.9:5000/api/candidates/", {
        method: "GET",
      });
      const data = await res.json();
      setCandidates(data);
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <ScrollView className="flex-1 bg-white pt-20 px-4">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-blue-600">Candidates</Text>
        <TouchableOpacity
          className="bg-blue-600 px-4 py-2 rounded-xl"
          onPress={() => router.push("/(admin)/candidate/add")}
        >
          <Text className="text-white font-medium">+ Add</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3B82F6" className="mt-10" />
      ) : (
        candidates.map((candidate) => (
          <CandidateCard
            key={candidate._id}
            name={candidate.name}
            cnic={candidate.cnic}
            naHalqa={candidate.naHalqa}
            ppHalqa={candidate.ppHalqa}
            partyName={candidate.party ? candidate.party.name : "Independent"}
            symbolUri={candidate.symbol}
          />
        ))
      )}
    </ScrollView>
  );
}
