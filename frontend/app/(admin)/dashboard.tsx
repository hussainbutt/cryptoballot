import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AdminDashboard = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    Alert.alert("Logged Out", "You have been logged out.");
    router.replace("/login");
  };

  return (
    <View className="h-[100vh]">
      <ScrollView className="flex bg-white px-6 pt-6">
        <Text className="text-3xl font-bold text-blue-700 mb-2 text-center mt-20">
          Admin Dashboard
        </Text>

        <Text className="text-base text-gray-600 my-3 mb-8 text-center">
          Welcome back, Admin!
        </Text>

        <View className="space-y-5 gap-10">
          <TouchableOpacity
            onPress={() => router.push("/(admin)/elections")}
            className="bg-blue-500 py-10 rounded-2xl flex-row items-center justify-center"
          >
            <Ionicons name="create" size={24} color="white" />
            <Text className="text-white ml-4 text-lg font-medium">
              Manage Elections
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(admin)/candidates")}
            className="bg-green-500 py-10 rounded-2xl flex-row items-center justify-center"
          >
            <Ionicons name="people" size={24} color="white" />
            <Text className="text-white ml-4 text-lg font-medium">
              Manage Candidates
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(admin)/parties")}
            className="bg-purple-500 py-10 rounded-2xl flex-row items-center justify-center"
          >
            <Ionicons name="flag" size={24} color="white" />
            <Text className="text-white ml-4 text-lg font-medium">
              Manage Parties
            </Text>
          </TouchableOpacity>

          {/* 📜 History / Previous Elections Button */}
          <TouchableOpacity
            onPress={() => router.push("/(admin)/history")}
            className="bg-gray-600 py-10 rounded-2xl flex-row items-center justify-center"
          >
            <Ionicons name="time-outline" size={24} color="white" />
            <Text className="text-white ml-4 text-lg font-medium">
              Previous Elections
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-600 py-4 rounded-2xl flex-row items-center justify-center mt-10"
          >
            <Ionicons name="log-out-outline" size={24} color="white" />
            <Text className="text-white ml-4 text-lg font-medium">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default AdminDashboard;
