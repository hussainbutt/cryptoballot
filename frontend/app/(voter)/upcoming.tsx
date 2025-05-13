import { useState, useEffect } from "react";
import { View, Text, Alert, FlatList, TouchableOpacity } from "react-native";
import ElectionCard from "../../components/ui/ElectionCard";
import { useRouter } from "expo-router";

interface Election {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
}

export default function UpcomingElectionsScreen() {
  const [elections, setElections] = useState<Election[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchElections = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("http://192.168.18.82:5000/api/elections/filter?status=upcoming");
      const data = await res.json();
      setElections(data);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  return (
    <View className="flex-1 bg-white px-4 py-20">
      <Text className="text-3xl font-bold text-center text-blue-600 mb-6">
        Upcoming Elections
      </Text>

      {elections.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500 text-lg">No upcoming elections</Text>
        </View>
      ) : (
        <FlatList
          data={elections}
          keyExtractor={(item) => item._id}
          onRefresh={fetchElections}
          refreshing={refreshing}
          renderItem={({ item }) => (
            <View className="bg-gray-100 p-4 mb-4 rounded-xl shadow-md">
              <Text className="text-xl font-semibold text-gray-800">{item.title}</Text>
              <Text className="text-sm text-gray-500">
                Start: {new Date(item.startTime).toLocaleString()}
              </Text>
              <Text className="text-sm text-gray-500">
                End: {new Date(item.endTime).toLocaleString()}
              </Text>
              <Text className="text-sm font-semibold text-yellow-600">
                Status: {item.status}
              </Text>

              <TouchableOpacity
                className="bg-blue-600 py-2 px-4 rounded-lg mt-4"
                onPress={() => router.push(`/elections/${item._id}`)}
              >
                <Text className="text-white font-semibold text-center">
                  View Details
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
} 