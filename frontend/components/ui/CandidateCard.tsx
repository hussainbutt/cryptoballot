// components/CandidateCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";

interface CandidateCardProps {
  candidate: any;
  toggleStatus: (id: string, currentStatus: string) => void;
  deleteCandidate: (id: string) => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  toggleStatus,
  deleteCandidate,
}) => {
  const handleDelete = async () => {
    Alert.alert(
      "Delete Candidate",
      `Are you sure you want to delete ${candidate.fullName}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const res = await fetch(
                `http://192.168.1.13:5000/api/candidates/${candidate._id}`,
                {
                  method: "DELETE",
                }
              );
              if (res.ok) {
                deleteCandidate(candidate._id); // Remove from parent list
                Alert.alert("Success", "Candidate deleted successfully");
              } else {
                const data = await res.json();
                Alert.alert(
                  "Error",
                  data.message || "Failed to delete candidate"
                );
              }
            } catch (err) {
              Alert.alert("Error", err.message);
            }
          },
        },
      ]
    );
  };

  return (
    <View className="bg-white p-4 rounded-xl mb-3 shadow-sm border border-gray-200">
      <Text className="font-bold text-lg text-gray-800">
        {candidate.fullName}
      </Text>
      <Text className="text-sm text-gray-500">CNIC: {candidate.cnic}</Text>
      <Text className="text-sm text-gray-500">Halqa: {candidate.halqa}</Text>
      <Text className="text-sm text-gray-500">
        Election: {candidate.election?.title}
      </Text>
      <Text className="text-sm text-gray-500">
        Party: {candidate.party?.partyName || "Independent"}
      </Text>

      <TouchableOpacity
        className="mt-3 bg-red-500 px-4 py-2 rounded-lg"
        onPress={handleDelete}
      >
        <Text className="text-white text-center font-semibold">Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CandidateCard;
