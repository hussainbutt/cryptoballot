import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";

const AdminHistoryScreen = () => {
  const [endedElections, setEndedElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchEndedElections = async () => {
    try {
      const res = await fetch(
        `http://192.168.1.3:5000/api/elections/filter?status=ended`
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
          <View
            key={election._id}
            className="bg-gray-100 rounded-xl p-4 mb-4 shadow-md"
          >
            <Text className="text-xl font-semibold text-gray-800">
              {election.title}
            </Text>
            <Text className="text-sm text-gray-600 mb-2">
              Ended On: {new Date(election.endTime).toLocaleString()}
            </Text>

            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => router.push(`/elections/${election._id}`)}
                className="bg-blue-600 py-2 px-4 rounded-lg"
              >
                <Text className="text-white font-medium">View Details</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push(`/analytics/${election._id}`)}
                className="bg-yellow-600 py-2 px-4 rounded-lg"
              >
                <Text className="text-white font-medium">See Analytics</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default AdminHistoryScreen;
