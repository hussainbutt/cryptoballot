// components/ElectionCard.tsx
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

interface ElectionCardProps {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
}

export default function ElectionCard({
  id,
  title,
  startTime,
  endTime,
  status,
}: ElectionCardProps) {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`./(admin)/elections/${id}`);
  };

  return (
    <View className="bg-gray-100 p-4 mb-4 rounded-xl shadow-md">
      <Text className="text-xl font-semibold text-gray-800">{title}</Text>
      <Text className="text-sm text-gray-500">
        Start: {new Date(startTime).toLocaleString()}
      </Text>
      <Text className="text-sm text-gray-500">
        End: {new Date(endTime).toLocaleString()}
      </Text>
      <Text className="text-sm text-gray-500">Status: {status}</Text>

      <TouchableOpacity
        className="bg-blue-600 py-2 px-4 rounded-lg mt-4"
        onPress={handleViewDetails}
      >
        <Text className="text-white font-semibold text-center">
          View Details
        </Text>
      </TouchableOpacity>
    </View>
  );
}
