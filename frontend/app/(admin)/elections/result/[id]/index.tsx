import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

export default function AnalyticsScreen() {
  const { id } = useLocalSearchParams();
  const electionId = id;

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
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 p-4 pt-16 shadow-md">
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

  // Election type configuration
  const electionTypes = {
    NA: { name: "National", prefix: "NA", color: "purple" },
    PP: { name: "Punjab", prefix: "PP", color: "yellow" },
    PS: { name: "Sindh", prefix: "PS", color: "green" },
    PK: { name: "Khyber Pakhtunkhwa", prefix: "PK", color: "red" },
    PB: { name: "Balochistan", prefix: "PB", color: "blue" },
  };

  // Group halqas by their type
  const groupByElectionType = () => {
    const groupedResults = {};

    // Initialize all election types
    Object.keys(electionTypes).forEach((key) => {
      groupedResults[key] = {
        ...electionTypes[key],
        parties: {},
        totalHalqas: 0,
      };
    });

    // Count halqas and party wins per type
    Object.entries(results.halqaWinners).forEach(([halqa, winner]) => {
      const prefix = halqa.match(/[A-Z]+/)?.[0];
      if (prefix && groupedResults[prefix]) {
        groupedResults[prefix].totalHalqas++;

        if (!groupedResults[prefix].parties[winner.partyName]) {
          groupedResults[prefix].parties[winner.partyName] = {
            count: 0,
            partySymbol: winner.partySymbol,
          };
        }
        groupedResults[prefix].parties[winner.partyName].count++;
      }
    });

    // Convert to array format for display
    return Object.values(groupedResults)
      .filter((type) => type.totalHalqas > 0) // Only show types with halqas
      .map((type) => {
        const partyResults = Object.entries(type.parties).map(
          ([partyName, data]) => ({
            partyName,
            partySymbol: data.partySymbol,
            halqasWonCount: data.count,
            halqaPercentage: ((data.count / type.totalHalqas) * 100).toFixed(2),
          })
        );

        // Sort parties by halqas won
        partyResults.sort((a, b) => b.halqasWonCount - a.halqasWonCount);

        // Find leading party
        const leadingParty = partyResults.length > 0 ? partyResults[0] : null;

        return {
          ...type,
          partyResults,
          leadingParty,
        };
      });
  };

  const electionTypeResults = groupByElectionType();

  // Function to prepare pie chart data for each election type
  const getPieData = (partyResults) => {
    return partyResults.map((party) => ({
      name: party.partyName,
      percentage: parseFloat(party.halqaPercentage),
      color: getRandomColor(),
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    }));
  };

  return (
    <View className="space-y-6">
      {/* National Election Winner Card - Only shown if national results exist */}
      {electionTypeResults.find((type) => type.prefix === "NA") && (
        <View className="bg-white p-4 rounded-lg shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-2">
            National Election Winner
          </Text>
          {leadingParty ? (
            <View className="flex-row items-center space-x-4">
              {leadingParty.partySymbol ? (
                <Image
                  source={{ uri: leadingParty.partySymbol }}
                  className="w-16 h-16 rounded-full"
                  resizeMode="contain"
                />
              ) : (
                <View className="w-16 h-16 rounded-full bg-purple-100 items-center justify-center">
                  <Text className="text-2xl font-bold text-purple-600">
                    {leadingParty.partyName.charAt(0)}
                  </Text>
                </View>
              )}
              <View className="pl-4">
                <Text className="text-xl font-semibold">
                  {leadingParty.partyName}
                </Text>
                <Text className="text-gray-600">
                  Won {leadingParty.halqasWonCount} national halqas
                </Text>
              </View>
            </View>
          ) : (
            <Text className="text-gray-500">No winner data available</Text>
          )}
        </View>
      )}

      {/* Election Type Results - Shows all types (national and provincial) */}
      {electionTypeResults.map((type, index) => {
        const pieData = getPieData(type.partyResults);

        return (
          <View
            key={index}
            className="bg-white p-4 rounded-lg shadow-sm space-y-4"
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-bold text-gray-800">
                {type.name} Results
              </Text>
              <Text className="text-gray-600">
                Total Halqas: {type.totalHalqas}
              </Text>
            </View>

            {/* Pie Chart */}
            {pieData.length > 0 && (
              <View className="items-center">
                <PieChart
                  data={pieData}
                  width={screenWidth - 32}
                  height={200}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  accessor="percentage"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute // Show absolute values instead of percentages
                />
              </View>
            )}

            {/* Leading Party */}
            {type.leadingParty && (
              <View className={`bg-${type.color}-50 p-3 rounded-md`}>
                <Text className={`font-medium text-${type.color}-800`}>
                  Leading Party:
                </Text>
                <View className="flex-row items-center mt-1 space-x-3">
                  {type.leadingParty.partySymbol ? (
                    <Image
                      source={{ uri: type.leadingParty.partySymbol }}
                      className="w-10 h-10 rounded-full"
                      resizeMode="contain"
                    />
                  ) : (
                    <View
                      className={`w-10 h-10 rounded-full bg-${type.color}-100 items-center justify-center`}
                    >
                      <Text
                        className={`text-lg font-bold text-${type.color}-600`}
                      >
                        {type.leadingParty.partyName.charAt(0)}
                      </Text>
                    </View>
                  )}
                  <View>
                    <Text className="font-semibold">
                      {type.leadingParty.partyName}
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      Won {type.leadingParty.halqasWonCount} of{" "}
                      {type.totalHalqas} halqas (
                      {type.leadingParty.halqaPercentage}%)
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Parties Performance */}
            <View className="space-y-3">
              <Text className="font-medium text-gray-700">
                Parties Performance:
              </Text>
              {type.partyResults.map((party, partyIndex) => (
                <View key={partyIndex} className="space-y-1">
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center space-x-2">
                      {party.partySymbol && (
                        <Image
                          source={{ uri: party.partySymbol }}
                          className="w-6 h-6"
                          resizeMode="contain"
                        />
                      )}
                      <Text className="font-medium">{party.partyName}</Text>
                    </View>
                    <Text className="font-medium">
                      {party.halqaPercentage}%
                    </Text>
                  </View>
                  <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <View
                      className={`h-full bg-blue-500 rounded-full`}
                      style={{ width: `${party.halqaPercentage}%` }}
                    />
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-500 text-sm">
                      {party.halqasWonCount} halqas
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {party.halqaPercentage}%
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        );
      })}
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

  // Election type configuration
  const electionTypes = {
    NA: { name: "National", color: "purple" },
    PP: { name: "Punjab", color: "yellow" },
    PS: { name: "Sindh", color: "green" },
    PK: { name: "Khyber Pakhtunkhwa", color: "red" },
    PB: { name: "Balochistan", color: "blue" },
  };

  // Group halqas by their type
  const groupedHalqas = {};

  Object.entries(results.halqaWinners).forEach(([halqa, winner]) => {
    const prefix = halqa.match(/[A-Z]+/)?.[0];
    if (prefix && electionTypes[prefix]) {
      if (!groupedHalqas[prefix]) {
        groupedHalqas[prefix] = {
          name: electionTypes[prefix].name,
          color: electionTypes[prefix].color,
          halqas: [],
        };
      }
      groupedHalqas[prefix].halqas.push({ halqa, winner });
    }
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

      {Object.entries(groupedHalqas).map(([prefix, group], index) => (
        <View
          key={index}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          {/* Group Header */}
          <TouchableOpacity
            className={`p-4 bg-${group.color}-100 flex-row justify-between items-center`}
            onPress={() => toggleGroup(prefix)}
          >
            <Text className={`text-${group.color}-700 font-bold text-lg`}>
              {group.name} Results ({group.halqas.length} halqas)
            </Text>
            <Text className={`text-${group.color}-500`}>
              {collapsedGroups[prefix] ? "▼" : "▲"}
            </Text>
          </TouchableOpacity>

          {/* Group Content */}
          {!collapsedGroups[prefix] && (
            <View className="p-4 space-y-3">
              {group.halqas.map(({ halqa, winner }, i) => (
                <View key={i} className="border border-gray-200 p-3 rounded-md">
                  <Text className="font-bold text-gray-800">{halqa}</Text>
                  <View className="mt-2 flex-row items-center space-x-3">
                    {winner?.partySymbol && (
                      <Image
                        source={{ uri: winner.partySymbol }}
                        className="w-8 h-8"
                        resizeMode="contain"
                      />
                    )}
                    <View>
                      <Text className="text-gray-700">
                        <Text className="font-semibold">
                          {winner?.partyName || "No winner data"}
                        </Text>
                      </Text>
                      {winner?.candidateName && (
                        <Text className="text-gray-600 text-sm">
                          Candidate: {winner.candidateName}
                        </Text>
                      )}
                    </View>
                  </View>
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
    "#84CC16", // lime-500
    "#06B6D4", // cyan-500
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
