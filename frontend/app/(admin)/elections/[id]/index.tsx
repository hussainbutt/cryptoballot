import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function ElectionDetailScreen() {
  const { id } = useLocalSearchParams();
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchElection = async () => {
    try {
      const res = await fetch(`http://192.168.18.82:5000/api/elections/${id}`);
      const data = await res.json();

      if (res.ok) {
        setElection(data);
      } else {
        Alert.alert("Error", data.message || "Failed to fetch election");
      }
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = () => {
    const now = new Date();
    const start = new Date(election.startTime);
    const end = new Date(election.endTime);

    if (now < start) return "Upcoming";
    if (now >= start && now <= end) return "Active";
    return "Completed";
  };

  useEffect(() => {
    fetchElection();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!election) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-4">
        <Text className="text-center text-lg text-gray-600">
          Election not found.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerClassName="flex-1 justify-center items-center bg-white px-4 py-6">
      <View className="w-full max-w-md bg-gray-100 rounded-2xl p-6 shadow-md">
        <Text className="text-3xl font-extrabold text-blue-600 text-center mb-6">
          {election.title}
        </Text>

        <View className="space-y-4">
          <DetailRow label="Election Type" value={election.electionType} />
          <DetailRow
            label="Start Time"
            value={new Date(election.startTime).toLocaleString()}
          />
          <DetailRow
            label="End Time"
            value={new Date(election.endTime).toLocaleString()}
          />
          <DetailRow label="Current Status" value={getStatus()} />
        </View>
      </View>
    </ScrollView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text className="text-sm text-gray-500 font-medium mb-1">{label}:</Text>
      <Text className="text-lg text-gray-900 font-semibold">{value}</Text>
    </View>
  );
}
