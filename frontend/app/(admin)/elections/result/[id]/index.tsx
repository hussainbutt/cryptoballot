import { Button, View, Text, ScrollView, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

export default function AnalyticsScreen() {
  //   const router = useRouter();
  const { id } = useLocalSearchParams();
  const electionId = id;
  console.log(id);

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [leadingParty, setLeadingParty] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchResults();
    fetchLeadingParty();
  }, [electionId]);

  const fetchResults = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.13:5000/api/analytics/results/${electionId}`
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeadingParty = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.13:5000/api/analytics/leading-party/${electionId}`
      );
      const data = await response.json();
      setLeadingParty(data);
    } catch (error) {
      console.error("Error fetching leading party:", error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-lg font-semibold">Loading analytics...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 py-8 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 p-4 shadow-md">
        <Text className="text-white text-2xl font-bold text-center">
          Election Analytics
        </Text>
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-gray-200">
        <TouchableOpacity
          className={`flex-1 py-3 ${
            activeTab === "overview" ? "border-b-2 border-blue-500" : ""
          }`}
          onPress={() => setActiveTab("overview")}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === "overview" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 ${
            activeTab === "halqas" ? "border-b-2 border-blue-500" : ""
          }`}
          onPress={() => setActiveTab("halqas")}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === "halqas" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            Halqa Results
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 p-4">
        {activeTab === "overview" ? (
          <OverviewTab results={results} leadingParty={leadingParty} />
        ) : (
          <HalqaResultsTab results={results} />
        )}
      </ScrollView>
    </View>
  );
}
function OverviewTab({ results, leadingParty }) {
  const screenWidth = Dimensions.get("window").width;

  // Function to group halqas by province
  const groupByProvince = () => {
    const provinces = {
      punjab: { prefix: "PP", name: "Punjab", parties: {}, totalHalqas: 0 },
      sindh: { prefix: "PS", name: "Sindh", parties: {}, totalHalqas: 0 },
      kpk: {
        prefix: "PK",
        name: "Khyber Pakhtunkhwa",
        parties: {},
        totalHalqas: 0,
      },
      balochistan: {
        prefix: "PB",
        name: "Balochistan",
        parties: {},
        totalHalqas: 0,
      },
    };

    // Count total halqas and party wins per province
    Object.entries(results.halqaWinners).forEach(([halqa, winner]) => {
      const prefix = halqa.substring(0, 2);
      const provinceKey = Object.keys(provinces).find(
        (key) => provinces[key].prefix === prefix
      );

      if (provinceKey) {
        provinces[provinceKey].totalHalqas++;

        if (!provinces[provinceKey].parties[winner.partyName]) {
          provinces[provinceKey].parties[winner.partyName] = 0;
        }
        provinces[provinceKey].parties[winner.partyName]++;
      }
    });

    // Convert to array format for display
    return Object.values(provinces).map((province) => {
      const partyResults = Object.entries(province.parties).map(
        ([partyName, count]) => ({
          partyName,
          halqasWonCount: count,
          halqaPercentage: ((count / province.totalHalqas) * 100).toFixed(2),
        })
      );

      // Find leading party in province
      const leadingParty =
        partyResults.length > 0
          ? partyResults.reduce((prev, current) =>
              prev.halqasWonCount > current.halqasWonCount ? prev : current
            )
          : null;

      return {
        ...province,
        partyResults,
        leadingParty,
      };
    });
  };

  const provinceResults = groupByProvince();

  // Prepare data for national pie chart
  const pieData = results?.parties.map((party) => ({
    name: party.partyName,
    percentage: parseFloat(party.halqaPercentage),
    color: getRandomColor(),
    legendFontColor: "#7F7F7F",
    legendFontSize: 12,
  }));

  return (
    <View className="space-y-6">
      {/* National Election Winner Card */}
      <View className="bg-white p-4 rounded-lg shadow-sm">
        <Text className="text-lg font-bold text-gray-800 mb-2">
          National Election Winner
        </Text>
        {results?.electionWinner ? (
          <View className="flex-row items-center space-x-4">
            <View className="w-16 h-16 rounded-full bg-green-100 items-center justify-center">
              <Text className="text-2xl font-bold text-green-600">
                {results.electionWinner.partyName.charAt(0)}
              </Text>
            </View>
            <View>
              <Text className="text-xl font-semibold">
                {results.electionWinner.partyName}
              </Text>
              <Text className="text-gray-600">
                Won {results.electionWinner.halqasWonCount} halqas nationwide
              </Text>
              <Text className="text-green-600 font-medium">
                {results.electionWinner.halqaPercentage}% of total halqas
              </Text>
            </View>
          </View>
        ) : (
          <Text className="text-gray-500">No winner data available</Text>
        )}
      </View>

      {/* National Pie Chart */}
      {pieData && pieData.length > 0 && (
        <View className="bg-white p-4 rounded-lg shadow-sm items-center">
          <Text className="text-lg font-bold text-gray-800 mb-2">
            National Halqa Distribution
          </Text>
          <PieChart
            data={pieData}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="percentage"
            backgroundColor="transparent"
            paddingLeft="15"
          />
        </View>
      )}

      {/* Provincial Results */}
      <Text className="text-lg font-bold text-gray-800 px-4">
        Provincial Results
      </Text>

      {provinceResults.map((province, index) => (
        <View key={index} className="bg-white p-4 rounded-lg shadow-sm">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-gray-800">
              {province.name} Results
            </Text>
            <Text className="text-gray-600">
              Total Halqas: {province.totalHalqas}
            </Text>
          </View>

          {/* Provincial Winner */}
          {province.leadingParty && (
            <View className="bg-blue-50 p-3 rounded-md mb-4">
              <Text className="font-medium text-blue-800">Leading Party:</Text>
              <View className="flex-row items-center mt-1 space-x-3">
                <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center">
                  <Text className="text-lg font-bold text-blue-600">
                    {province.leadingParty.partyName.charAt(0)}
                  </Text>
                </View>
                <View>
                  <Text className="font-semibold">
                    {province.leadingParty.partyName}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Won {province.leadingParty.halqasWonCount} of{" "}
                    {province.totalHalqas} halqas (
                    {province.leadingParty.halqaPercentage}%)
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Parties Performance in Province */}
          <Text className="font-medium text-gray-700 mb-2">
            Parties Performance:
          </Text>
          <View className="space-y-3">
            {province.partyResults.map((party, partyIndex) => (
              <View key={partyIndex} className="space-y-1">
                <View className="flex-row justify-between">
                  <Text className="font-medium">{party.partyName}</Text>
                  <Text className="font-medium">{party.halqaPercentage}%</Text>
                </View>
                <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${party.halqaPercentage}%` }}
                  />
                </View>
                <View className="flex-row justify-between text-sm">
                  <Text className="text-gray-500">
                    {party.halqasWonCount} halqas
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

function HalqaResultsTab({ results }) {
  const [collapsedGroups, setCollapsedGroups] = useState({});

  if (!results?.halqaWinners) {
    return (
      <View className="bg-white p-4 rounded-lg shadow-sm">
        <Text className="text-gray-500">No halqa results available</Text>
      </View>
    );
  }

  // Group halqas by their prefix (e.g., NA, PP, PK, PS, PB)
  const groupedHalqas = {};

  Object.entries(results.halqaWinners).forEach(([halqa, winner]) => {
    const prefix = halqa.match(/[A-Z]+/)[0]; // Extract the text part (NA, PP, etc.)
    if (!groupedHalqas[prefix]) {
      groupedHalqas[prefix] = [];
    }
    groupedHalqas[prefix].push({ halqa, winner });
  });

  const toggleGroup = (prefix) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [prefix]: !prev[prefix],
    }));
  };

  return (
    <View className="space-y-4">
      <Text className="text-lg font-bold text-gray-800 mb-2">
        Halqa-wise Winners
      </Text>

      {Object.entries(groupedHalqas).map(([prefix, halqas], index) => (
        <View key={index} className="bg-white rounded-lg shadow-sm">
          {/* Group Header */}
          <TouchableOpacity
            className="p-4 bg-blue-100 flex-row justify-between items-center rounded-t-lg"
            onPress={() => toggleGroup(prefix)}
          >
            <Text className="text-blue-700 font-bold text-lg">
              {prefix} Results
            </Text>
            <Text className="text-blue-500 text-sm">
              {collapsedGroups[prefix] ? "Show" : "Hide"}
            </Text>
          </TouchableOpacity>

          {/* Group Content */}
          {!collapsedGroups[prefix] && (
            <View className="p-4 space-y-4">
              {halqas.map(({ halqa, winner }, i) => (
                <View key={i} className="bg-gray-50 p-3 rounded-md">
                  <Text className="font-bold text-gray-800">{halqa}</Text>
                  <View className="mt-1">
                    <Text className="text-gray-700">
                      Winning Party:{" "}
                      <Text className="font-semibold">
                        {winner?.partyName || "No winner data"}
                      </Text>
                    </Text>
                  </View>
                  {winner?.candidateName && (
                    <View className="mt-1">
                      <Text className="text-gray-700">
                        Winning Candidate:{" "}
                        <Text className="font-semibold">
                          {winner.candidateName}
                        </Text>
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

// Helper function to generate random colors for pie chart
function getRandomColor() {
  const colors = [
    "#3B82F6", // blue-500
    "#EF4444", // red-500
    "#10B981", // emerald-500
    "#F59E0B", // amber-500
    "#8B5CF6", // violet-500
    "#EC4899", // pink-500
    "#14B8A6", // teal-500
    "#F97316", // orange-500
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
