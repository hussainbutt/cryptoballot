import React, { useEffect, useState } from "react";
import { ScrollView, Text, ActivityIndicator, View } from "react-native";
import ElectionCard from "../../../components/ui/OnGoingElectionCard";

const OngoingElections = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOngoing = async () => {
    try {
      const res = await fetch(
        "http://192.168.18.82:5000/api/elections/filter?status=ongoing"
      );
      const data = await res.json();
      setElections(data || []);
    } catch (err) {
      console.error("Error fetching ongoing elections:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOngoing();
  }, []);

  return (
    <ScrollView className="bg-white px-6 pt-16 h-[100vh]">
      <Text className="text-3xl font-bold text-green-700 text-center mb-4">
        Ongoing Elections
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : elections.length === 0 ? (
        <Text className="text-gray-500 text-center">No ongoing elections.</Text>
      ) : (
        elections.map((election: any) => (
          <ElectionCard key={election._id} election={election} />
        ))
      )}
    </ScrollView>
  );
};

export default OngoingElections;
