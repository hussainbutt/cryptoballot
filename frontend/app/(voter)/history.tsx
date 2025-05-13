import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import EndedElectionCard from "@/components/ui/EndedElectionCard";

const VoterHistory = () => {
  const [endedElections, setEndedElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEndedElections = async () => {
      try {
        const res = await fetch(
          "http://192.168.18.82:5000/api/elections?status=ended"
        );
        const data = await res.json();

        if (res.ok) {
          setEndedElections(data);
        } else {
          Alert.alert("Error", data.message || "Failed to fetch elections.");
        }
        console.log("====================================");
        console.log(endedElections);
        console.log("====================================");
      } catch (err) {
        Alert.alert("Error", err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchEndedElections();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#1e40af" />
        <Text className="mt-4 text-gray-500 text-base">
          Loading Elections...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-20">
      <Text className="text-3xl font-bold text-center text-blue-700 mb-4">
        Voting History
      </Text>

      {endedElections.length === 0 ? (
        <Text className="text-center text-gray-500 mt-10">
          No past elections found.
        </Text>
      ) : (
        endedElections.map((election: any) => (
          <EndedElectionCard key={election._id} election={election} />
        ))
      )}
    </ScrollView>
  );
};

export default VoterHistory;
