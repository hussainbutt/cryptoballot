import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";

interface CandidateCardProps {
  fullName: string;
  partyName: string;
  partySymbol: string;
  onVote: () => void;
  voted: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  fullName,
  partyName,
  partySymbol,
  onVote,
  voted,
}) => {
  return (
    <View className="bg-white rounded-xl p-4 mb-4 shadow-md border border-gray-200">
      {/* Top Row */}
      <View className="flex flex-row items-center space-x-4 mb-4">
        {/* Party Symbol */}

        {/* Candidate Info */}
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">{fullName}</Text>
          <Text className="text-sm text-gray-600">
            Party: <Text className="font-semibold">{partyName}</Text>
          </Text>
        </View>
        <Image
          source={{ uri: partySymbol }}
          style={{ width: 50, height: 50, borderRadius: 8, marginRight: 12 }}
        />
      </View>

      {/* Vote Button */}
      <TouchableOpacity
        onPress={onVote}
        disabled={voted}
        className={`py-2 px-4 rounded-lg ${
          voted ? "bg-green-600" : "bg-green-600"
        }`}
      >
        <Text className="text-white text-center font-semibold">
          {voted ? "Already Voted in this Election ✅" : "Vote 🗳️"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CandidateCard;
