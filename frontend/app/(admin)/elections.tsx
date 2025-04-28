import { useState, useEffect } from "react";
import { View, Text, Alert, FlatList, TouchableOpacity } from "react-native";
import ElectionCard from "../../components/ui/ElectionCard";
import { useRouter } from "expo-router";

export default function ElectionListScreen() {
  const [elections, setElections] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchElections = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("http://192.168.1.13:5000/api/elections");
      const data = await res.json();
      setElections(data);
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setRefreshing(false);
    }
  };
  const handleDeleteElection = async (id: string) => {
    try {
      const res = await fetch(`http://192.168.1.13:5000/api/elections/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        Alert.alert("Deleted", "Election has been deleted");
        fetchElections(); // reload
      } else {
        Alert.alert("Error", "Failed to delete election");
      }
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  return (
    <View className="flex-1 bg-white px-4 py-20">
      <Text className="text-3xl font-bold text-center text-blue-600 mb-6">
        Elections
      </Text>

      <FlatList
        data={elections}
        keyExtractor={(item) => item._id}
        onRefresh={fetchElections}
        refreshing={refreshing}
        renderItem={({ item }) => (
          <ElectionCard
            id={item._id}
            title={item.title}
            startTime={item.startTime}
            endTime={item.endTime}
            status={item.status}
            onDelete={handleDeleteElection}
          />
        )}
      />

      <TouchableOpacity
        className="bg-blue-600 py-3 rounded-lg shadow-lg mt-6"
        onPress={() => router.push("/(admin)/elections/create")}
      >
        <Text className="text-white text-center text-lg font-semibold">
          Create Election
        </Text>
      </TouchableOpacity>
    </View>
  );
}
