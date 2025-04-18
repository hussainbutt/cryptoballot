import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";

interface ElectionCardProps {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
  onDelete: (id: string) => void; // Add delete handler from parent
}

export default function ElectionCard({
  id,
  title,
  startTime,
  endTime,
  status,
  onDelete,
}: ElectionCardProps) {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/elections/${id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this election?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => onDelete(id) },
      ]
    );
  };

  const statusColor =
    status === "ongoing"
      ? "text-green-600"
      : status === "upcoming"
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <View className="bg-gray-100 p-4 mb-4 rounded-xl shadow-md">
      <Text className="text-xl font-semibold text-gray-800">{title}</Text>
      <Text className="text-sm text-gray-500">
        Start: {new Date(startTime).toLocaleString()}
      </Text>
      <Text className="text-sm text-gray-500">
        End: {new Date(endTime).toLocaleString()}
      </Text>
      <Text className={`text-sm font-semibold ${statusColor}`}>
        Status: {status}
      </Text>

      <TouchableOpacity
        className="bg-blue-600 py-2 px-4 rounded-lg mt-4 mb-2"
        onPress={handleViewDetails}
      >
        <Text className="text-white font-semibold text-center">
          View Details
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-red-500 py-2 px-4 rounded-lg mt-2"
        onPress={handleDelete}
      >
        <Text className="text-white font-semibold text-center">Delete</Text>
      </TouchableOpacity>
    </View>
  );
}
