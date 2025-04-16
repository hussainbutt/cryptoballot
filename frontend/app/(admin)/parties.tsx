import { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import PartyCard from "../../components/ui/PartyCard"; // Adjust path

export default function PartiesScreen() {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchParties = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://192.168.1.9:5000/api/parties");
      const data = await res.json();
      setParties(data);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
    setLoading(false);
  };

  const deleteParty = async (id: string) => {
    Alert.alert("Confirm Delete", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await fetch(`http://192.168.1.9:5000/api/parties/${id}`, {
              method: "DELETE",
            });
            fetchParties();
          } catch (err) {
            Alert.alert("Error", err.message);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchParties();
  }, []);

  return (
    <View className="flex-1 bg-white px-6 pt-10 mt-10">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-3xl font-extrabold text-blue-600">Parties</Text>
        <Link
          href="/(admin)/parties/add"
          className="text-blue-500 font-semibold text-base"
        >
          + Add
        </Link>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3B82F6" />
      ) : (
        <FlatList
          data={parties}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <PartyCard
              name={item.name}
              leader={item.leader}
              symbol={item.symbol}
              onDelete={() => deleteParty(item._id)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}
