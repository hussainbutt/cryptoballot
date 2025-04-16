// app/(admin)/candidates/[id]/index.tsx
import { useState, useEffect } from "react";
import { Text, View, Image, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

export default function CandidateDetailScreen() {
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const { query } = useRouter();
  const { id } = query;

  const fetchCandidate = async () => {
    try {
      const res = await fetch(`http://192.168.1.9:5000/api/candidates/${id}`);
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

  if (loading) {
    return <ActivityIndicator size="large" color="#3B82F6" />;
  }

  if (!candidate) {
    return <Text>No candidate found</Text>;
  }

  return (
    <View className="flex-1 bg-white p-4">
      <Image
        source={{ uri: candidate.symbol }}
        style={{ width: 100, height: 100, borderRadius: 50 }}
      />
      <Text className="text-2xl font-bold">{candidate.name}</Text>
      <Text className="text-lg">{candidate.cnic}</Text>
      <Text>NA Halqa: {candidate.naHalqa}</Text>
      <Text>PP Halqa: {candidate.ppHalqa}</Text>
      <Text>
        Party: {candidate.party ? candidate.party.name : "Independent"}
      </Text>
    </View>
  );
}
