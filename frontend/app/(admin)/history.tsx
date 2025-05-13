import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import EndedElectionCard from "@/components/ui/EndedElectionCard";

const AdminHistoryScreen = () => {
  const [endedElections, setEndedElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchEndedElections = async () => {
    try {
      const res = await fetch(
        `http://192.168.18.82:5000/api/elections/filter?status=ended`
      );
      const data = await res.json();
      setEndedElections(data || []);
    } catch (err) {
      console.error("Error fetching ended elections:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEndedElections();
  }, []);

  return (
    <ScrollView className="flex bg-white px-6 pt-16 h-[100vh]">
      <Text className="text-3xl font-bold text-blue-700 text-center mb-4">
        Previous Elections
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : endedElections.length === 0 ? (
        <Text className="text-gray-500 text-center">No ended elections.</Text>
      ) : (
        endedElections.map((election: any) => (
          <EndedElectionCard key={election._id} election={election} />
        ))
      )}
    </ScrollView>
  );
};

export default AdminHistoryScreen;
