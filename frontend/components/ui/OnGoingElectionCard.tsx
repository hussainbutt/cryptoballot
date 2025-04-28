import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const ElectionCard = ({ election }: { election: any }) => {
  console.log(election._id);

  const router = useRouter();

  return (
    <View className="bg-white shadow-md rounded-xl p-4 mb-4 border border-gray-200">
      <Text className="text-xl font-bold text-blue-700 mb-1">
        {election.title}
      </Text>

      <Text className="text-sm text-gray-500 mb-2">
        Ends On: {new Date(election.endTime).toLocaleString()}
      </Text>

      <TouchableOpacity
        onPress={() => router.push(`/vote/${election._id}`)}
        className="bg-green-600 px-4 py-2 mt-2 rounded-lg self-start"
      >
        <Text className="text-center text-white font-semibold text-base">
          Vote Now
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ElectionCard;
