import React, { useEffect, useState } from "react";
import { ScrollView, Text, ActivityIndicator, Alert, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CandidateCard from "../../../components/ui/VoteCandidateCard";

const ElectionVoteScreen = () => {
  const { id } = useLocalSearchParams();
  const electionId = id;

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voterId, setVoterId] = useState("");
  const [votedCandidateId, setVotedCandidateId] = useState("");
  const [voterInfo, setVoterInfo] = useState<any>(null);
  const [electionInfo, setElectionInfo] = useState<any>(null);

  const getProvinceFromHalqa = (halqa: string) => {
    if (halqa.startsWith("PP-")) return "Punjab";
    if (halqa.startsWith("PK-")) return "Khyber Pakhtunkhwa";
    if (halqa.startsWith("PS-")) return "Sindh";
    if (halqa.startsWith("PB-")) return "Balochistan";
    return "Unknown";
  };

  const capitalize = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const fetchInitialData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (!userData) {
        Alert.alert("Error", "User not found in storage.");
        return;
      }

      const user = JSON.parse(userData);
      setVoterId(user._id);
      setVoterInfo(user);

      // Fetch election info
      const electionRes = await fetch(
        `http://192.168.1.13:5000/api/elections/${electionId}`
      );
      const electionData = await electionRes.json();
      setElectionInfo(electionData || null);

      // Fetch candidates
      const candidatesRes = await fetch(
        `http://192.168.1.13:5000/api/votes/candidates?voterId=${user._id}&electionId=${electionId}`
      );
      const candidatesData = await candidatesRes.json();
      setCandidates(candidatesData || []);

      // Check if already voted
      const voteRes = await fetch(
        `http://192.168.1.13:5000/api/votes/check?voterId=${user._id}&electionId=${electionId}`
      );
      if (!voteRes) {
        console.log("dont know if voted before or not");
      }
      const voteData = await voteRes.json();

      if (voteData?.voted && voteData?.candidateId) {
        setVotedCandidateId(voteData.candidateId);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (electionId) {
      fetchInitialData();
    }
  }, [electionId]);

  const handleVote = async (candidateId: string) => {
    if (votedCandidateId) {
      Alert.alert("Already Voted", "You have already cast your vote.");
      return;
    }

    try {
      const res = await fetch("http://192.168.1.13:5000/api/votes/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voterId,
          candidateId,
          electionId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setVotedCandidateId(candidateId); // Mark as voted
        Alert.alert("Success", "Your vote has been successfully submitted!");
      } else {
        Alert.alert("Error", data.message || "Failed to vote.");
      }
    } catch (error) {
      console.error("Vote Error:", error);
      Alert.alert("Error", "Something went wrong while voting.");
    }
  };

  return (
    <ScrollView className="bg-white flex-1 px-6 pt-12">
      {/* Election and Voter Info */}
      {(electionInfo || voterInfo) && (
        <View className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
          {electionInfo && (
            <Text className="text-2xl font-bold text-blue-700 text-center mb-2">
              {electionInfo.title}
            </Text>
          )}
          <View className="flex flex-row flex-wrap justify-center gap-4 mt-2">
            {electionInfo && (
              <Text className="text-gray-600 text-sm">
                <Text className="font-semibold">Type:</Text>{" "}
                {capitalize(electionInfo.electionType)}
              </Text>
            )}

            {electionInfo?.electionType === "provincial" &&
              voterInfo?.provincialHalqa && (
                <>
                  <Text className="text-gray-600 text-sm">
                    <Text className="font-semibold">Province:</Text>{" "}
                    {getProvinceFromHalqa(voterInfo.provincialHalqa)}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    <Text className="font-semibold">Provincial Halqa:</Text>{" "}
                    {voterInfo.provincialHalqa}
                  </Text>
                </>
              )}

            {electionInfo?.electionType === "national" &&
              voterInfo?.nationalHalqa && (
                <Text className="text-gray-600 text-sm">
                  <Text className="font-semibold">National Halqa:</Text>{" "}
                  {voterInfo.nationalHalqa}
                </Text>
              )}
          </View>
        </View>
      )}

      {/* Voting Title */}
      <Text className="text-2xl font-bold text-green-700 text-center mb-4">
        Vote for Your Candidate
      </Text>

      {/* Candidate List */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : candidates.length === 0 ? (
        <Text className="text-gray-500 text-center">
          No candidates available for this election.
        </Text>
      ) : (
        candidates.map((candidate: any) => (
          <CandidateCard
            key={candidate._id}
            fullName={candidate.fullName}
            partyName={candidate?.party?.name || "Independent"}
            partySymbol={
              candidate?.party?.symbol ||
              "https://dummyimage.com/100x100/ccc/000.png&text=No+Symbol"
            }
            onVote={() => handleVote(candidate._id)}
            voted={!!votedCandidateId} // disable buttons if already voted
            isVotedCandidate={votedCandidateId === candidate._id} // highlight voted candidate
          />
        ))
      )}
    </ScrollView>
  );
};

export default ElectionVoteScreen;
