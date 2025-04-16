// screens/admin/ElectionListScreen.tsx
import { useState, useEffect } from "react";
import { View, Text, Alert, FlatList, TouchableOpacity } from "react-native";
import ElectionCard from "../../components/ui/ElectionCard"; // Import the ElectionCard component
import { useRouter } from "expo-router";

export default function ElectionListScreen() {
  const [elections, setElections] = useState([]);
  const router = useRouter();

  const fetchElections = async () => {
    try {
      const res = await fetch("http://192.168.1.9:5000/api/elections");
      const data = await res.json();
      setElections(data);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  return (
    <View className="flex-1 bg-white px-4 py-6">
      <Text className="text-2xl font-bold text-center text-blue-600 mb-6">
        Elections
      </Text>

      <FlatList
        data={elections}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ElectionCard
            key={item._id}
            id={item._id}
            title={item.title}
            startTime={item.startTime}
            endTime={item.endTime}
            status={item.status}
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
