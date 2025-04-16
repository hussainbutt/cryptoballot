import { View, Text, Image } from "react-native";

interface CandidateCardProps {
  name: string;
  cnic: string;
  naHalqa: string;
  ppHalqa: string;
  partyName: string;
  symbolUri: string;
}

export default function CandidateCard({
  name,
  cnic,
  naHalqa,
  ppHalqa,
  partyName,
  symbolUri,
}: CandidateCardProps) {
  return (
    <View className="bg-white border border-gray-200 rounded-2xl p-4 mb-4 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">{name}</Text>
          <Text className="text-gray-600 text-sm">CNIC: {cnic}</Text>
          <Text className="text-gray-600 text-sm">NA: {naHalqa}</Text>
          <Text className="text-gray-600 text-sm">PP: {ppHalqa}</Text>
          <Text className="text-blue-600 text-sm font-semibold mt-1">
            Party: {partyName}
          </Text>
        </View>

        <Image
          source={{ uri: symbolUri }}
          className="w-16 h-16 rounded-full ml-4 border border-gray-300"
        />
      </View>
    </View>
  );
}
