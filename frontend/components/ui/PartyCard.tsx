import { View, Text, Image, TouchableOpacity } from "react-native";

type PartyCardProps = {
  name: string;
  leader: string;
  symbol: string;
  onDelete: () => void;
};

export default function PartyCard({
  name,
  leader,
  symbol,
  onDelete,
}: PartyCardProps) {
  return (
    <View className="bg-gray-100 p-4 rounded-2xl mb-4 shadow-sm">
      <View className="flex-row items-center mb-3">
        <Image
          source={{ uri: symbol }}
          style={{ width: 50, height: 50, borderRadius: 8, marginRight: 12 }}
          resizeMode="contain"
        />
        <View>
          <Text className="text-lg font-bold text-gray-800">{name}</Text>
          <Text className="text-gray-600 text-sm">Leader: {leader}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onDelete}
        className="bg-red-500 px-4 py-2 rounded-xl self-start active:bg-red-600"
        activeOpacity={0.8}
      >
        <Text className="text-white text-sm font-medium">Delete</Text>
      </TouchableOpacity>
    </View>
  );
}
