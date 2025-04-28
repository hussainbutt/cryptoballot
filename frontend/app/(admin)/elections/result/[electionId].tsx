import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

export default function HalqaDetailScreen() {
  const { electionId, halqa } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetchHalqaResults();
  }, [electionId, halqa]);

  const fetchHalqaResults = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.13:5000/analytics/halqa-results/${electionId}`
      );
      const data = await response.json();
      const halqaData = data.find((item) => item.halqa === halqa);
      setResults(halqaData);
    } catch (error) {
      console.error("Error fetching halqa results:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-lg font-semibold">Loading halqa results...</Text>
      </View>
    );
  }

  if (!results) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-lg font-semibold">
          No results found for this halqa
        </Text>
      </View>
    );
  }

  // Prepare data for bar chart
  const chartData = {
    labels: results.candidates.map((c) => c.partyName),
    datasets: [
      {
        data: results.candidates.map((c) => c.votes),
      },
    ],
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* Header */}
      <View className="mb-6">
        <Text className="text-2xl font-bold text-gray-800">
          {results.halqa}
        </Text>
        <Text className="text-gray-600">{results.totalVotes} total votes</Text>
      </View>

      {/* Bar Chart */}
      <View className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <Text className="text-lg font-bold text-gray-800 mb-3">
          Vote Distribution
        </Text>
        <BarChart
          data={chartData}
          width={Dimensions.get("window").width - 32}
          height={220}
          yAxisLabel=""
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>

      {/* Candidates List */}
      <View className="bg-white p-4 rounded-lg shadow-sm">
        <Text className="text-lg font-bold text-gray-800 mb-3">
          Candidates Performance
        </Text>
        <View className="space-y-4">
          {results.candidates.map((candidate, index) => (
            <View key={index} className="space-y-1">
              <View className="flex-row justify-between">
                <Text className="font-medium">
                  {candidate.candidateName} ({candidate.partyName})
                </Text>
                <Text className="font-medium">{candidate.votePercentage}%</Text>
              </View>
              <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <View
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${candidate.votePercentage}%` }}
                />
              </View>
              <Text className="text-gray-500 text-sm">
                {candidate.votes} votes
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
