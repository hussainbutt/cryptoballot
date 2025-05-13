import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../../config";

interface Election {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface VerificationResult {
  match: boolean;
  validCount: number;
  corruptCount: number;
  totalVotes: number;
  details: {
    voteId: string;
    voterId: string;
    hash: string;
    verified: boolean;
  }[];
}

export default function VerifyVotesScreen() {
  const [elections, setElections] = useState<Election[]>([]);
  const [selectedElection, setSelectedElection] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  useEffect(() => {
    fetchEndedElections();
  }, []);

  const fetchEndedElections = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/elections/filter?status=ended`);
      if (!res.ok) {
        throw new Error('Failed to fetch elections');
      }
      const data = await res.json();
      setElections(data);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch elections");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyVotes = async () => {
    if (!selectedElection) {
      Alert.alert("Error", "Please select an election to verify");
      return;
    }

    try {
      setVerifying(true);
      const res = await fetch(
        `${API_URL}/api/blockchain/verify/${selectedElection}`,
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to verify votes");
      }

      const data = await res.json();
      setVerificationResult(data);
      
      if(data.corruptCount == 0){
        Alert.alert("Verification Successful!");
      }
      else{
        Alert.alert("Corrupt Votes Found!\nVerification Unsuccessful!")
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "An error occurred during verification");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-16">
      <Text className="text-3xl font-bold text-blue-700 text-center mb-8">
        Verify Votes
      </Text>

      <View className="space-y-6">
        <View>
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Select Ended Election
          </Text>
          <View className="bg-gray-100 rounded-xl p-2">
            <Picker
              selectedValue={selectedElection}
              onValueChange={(value) => setSelectedElection(value)}
              enabled={!loading}
            >
              <Picker.Item label="Select an election" value="" />
              {elections.map((election) => (
                <Picker.Item
                  key={election._id}
                  label={election.title}
                  value={election._id}
                />
              ))}
            </Picker>
          </View>
        </View>

        <TouchableOpacity
          className="bg-blue-600 py-4 rounded-xl flex-row items-center justify-center space-x-2"
          onPress={handleVerifyVotes}
          disabled={verifying || !selectedElection}
        >
          {verifying ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="shield-checkmark-outline" size={24} color="white" />
              <Text className="text-white font-semibold text-lg">
                Verify Votes on Blockchain
              </Text>
            </>
          )}
        </TouchableOpacity>

        {verificationResult && (
          <View className="space-y-4">
            <View className="bg-gray-50 p-4 rounded-xl">
              <Text className="text-xl font-bold text-gray-800 mb-2">Verification Summary</Text>
              <View className="space-y-2">
                <Text className="text-gray-600">
                  Total Votes: {verificationResult.totalVotes}
                </Text>
                <Text className="text-green-600">
                  Valid Votes: {verificationResult.validCount}
                </Text>
                <Text className="text-red-600">
                  Corrupt Votes: {verificationResult.corruptCount}
                </Text>
                <Text className={`font-bold ${verificationResult.corruptCount===0 ? 'text-green-600' : 'text-red-600'}`}>
                  Status: {verificationResult.corruptCount === 0 ? 'All Votes Verified' : 'Verification Failed'}
                </Text>
              </View>
            </View>

            <View className="bg-gray-50 p-4 rounded-xl">
              <Text className="text-xl font-bold text-gray-800 mb-2">Vote Details</Text>
              <ScrollView className="max-h-96">
                {verificationResult.details.map((detail, index) => (
                  <View key={detail.voteId} className="border-b border-gray-200 py-2">
                    <Text className="text-gray-600">Vote #{index + 1}</Text>
                    <Text className="text-gray-500 text-sm">Voter ID: {detail.voterId}</Text>
                    <Text className="text-gray-500 text-sm">Hash: {detail.hash}</Text>
                    <Text className={`${detail.verified ? 'text-green-600' : 'text-red-600'}`}>
                      Status: {detail.verified ? 'Verified' : 'Not Verified'}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        <View className="bg-gray-50 p-4 rounded-xl">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            About Vote Verification
          </Text>
          <Text className="text-gray-600">
            This process verifies that the votes stored in our database match the
            hashes stored on the Internet Computer blockchain. This ensures the
            integrity and immutability of the voting process.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
} 