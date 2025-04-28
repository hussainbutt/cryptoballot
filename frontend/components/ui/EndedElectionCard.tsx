import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const EndedElectionCard = ({ election }) => {
  const router = useRouter();

  return (
    <View className="bg-gray-100 rounded-xl p-4 mb-4 shadow-md">
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
          onPress={() => router.push(`/elections/result/${election._id}`)}
          className="bg-green-600 py-2 px-4 rounded-lg"
        >
          <Text className="text-white font-medium">See Results</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EndedElectionCard;
