import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AddCandidateScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [cnic, setCnic] = useState("");
  const [elections, setElections] = useState([]);
  const [electionId, setElectionId] = useState("");
  const [electionType, setElectionType] = useState("");
  const [parties, setParties] = useState([]);
  const [partyId, setPartyId] = useState("");
  const [province, setProvince] = useState("");
  const [halqaNumber, setHalqaNumber] = useState("");
  const [symbolUri, setSymbolUri] = useState(null);

  useEffect(() => {
    fetch("http://192.168.18.82:5000/api/elections/filter?status=upcoming")
      .then((res) => res.json())
      .then((data) => setElections(data))
      .catch((err) => console.error("Error fetching upcoming elections:", err));

    fetch("http://192.168.18.82:5000/api/parties")
      .then((res) => res.json())
      .then((data) => setParties(data));
  }, []);

  const pickSymbol = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      setSymbolUri(result.assets[0].uri);
    }
  };

  const getHalqaPrefix = () => {
    if (electionType === "general") return "NA-";
    if (electionType === "provincial") {
      switch (province) {
        case "Punjab":
          return "PP-";
        case "Sindh":
          return "PS-";
        case "KPK":
          return "PK-";
        case "Balochistan":
          return "PB-";
        default:
          return "";
      }
    }
    return "";
  };

  const handleSubmit = async () => {
    try {
      const halqa = getHalqaPrefix() + halqaNumber;

      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("cnic", cnic);
      formData.append("electionId", electionId);
      formData.append("partyId", partyId || "");
      formData.append("halqa", halqa);

      if (!partyId && symbolUri) {
        const fileName = symbolUri.split("/").pop();
        const fileType = symbolUri.match(/\.\w+$/)?.[0];

        formData.append("symbol", {
          uri: symbolUri,
          name: fileName || "symbol.jpg",
          type: `image/${fileType?.replace(".", "") || "jpeg"}`,
        } as any);
      }
      console.log(formData);

      const res = await fetch("http://192.168.18.82:5000/api/candidates", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Something went wrong");

      Alert.alert("Success", "Candidate added!");
      router.push("/(admin)/candidates");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.message);
    }
  };

  return (
    <ScrollView className="p-5 bg-white">
      <Text className="text-2xl font-bold mb-4 text-center text-blue-700">
        Add New Candidate
      </Text>

      <TextInput
        placeholder="Full Name"
        className="border border-gray-300 p-3 rounded mb-4"
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        placeholder="CNIC (without dashes)"
        className="border border-gray-300 p-3 rounded mb-4"
        keyboardType="numeric"
        value={cnic}
        onChangeText={setCnic}
      />

      {/* Election Picker */}
      <Text className="font-semibold text-gray-700 mb-2">Election</Text>
      {elections.map((el) => (
        <TouchableOpacity
          key={el._id}
          className={`p-3 rounded border mb-2 ${
            electionId === el._id
              ? "bg-blue-200 border-blue-500"
              : "border-gray-300"
          }`}
          onPress={() => {
            setElectionId(el._id);
            setElectionType(el.electionType);
          }}
        >
          <Text className="text-gray-800">
            {el.title} ({el.electionType})
          </Text>
        </TouchableOpacity>
      ))}

      {/* Party Picker */}
      <Text className="font-semibold text-gray-700 mt-4 mb-2">
        Party (optional)
      </Text>
      {parties.map((p) => (
        <TouchableOpacity
          key={p._id}
          className={`p-3 rounded border mb-2 ${
            partyId === p._id
              ? "bg-green-200 border-green-500"
              : "border-gray-300"
          }`}
          onPress={() => setPartyId(p._id)}
        >
          <Text className="text-gray-800">{p.name}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        onPress={() => setPartyId("")}
        className={`p-3 rounded border mb-4 ${
          !partyId ? "bg-red-100 border-red-400" : "border-gray-300"
        }`}
      >
        <Text className="text-red-700 font-semibold">
          Independent Candidate
        </Text>
      </TouchableOpacity>

      {electionType === "provincial" && (
        <>
          <Text className="font-semibold text-gray-700 mb-2">Province</Text>
          {["Punjab", "Sindh", "KPK", "Balochistan"].map((prov) => (
            <TouchableOpacity
              key={prov}
              className={`p-3 rounded border mb-2 ${
                province === prov
                  ? "bg-yellow-200 border-yellow-500"
                  : "border-gray-300"
              }`}
              onPress={() => setProvince(prov)}
            >
              <Text className="text-gray-800">{prov}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      <View className="mb-4">
        <Text className="font-semibold text-gray-700 mb-1">
          Halqa (Prefix: {getHalqaPrefix() || "N/A"})
        </Text>

        <TextInput
          placeholder="Enter Halqa Number (e.g. 122)"
          keyboardType="numeric"
          className="border border-gray-300 p-3 rounded"
          value={halqaNumber}
          onChangeText={setHalqaNumber}
        />

        {halqaNumber.length > 0 && (
          <Text className="text-sm text-gray-500 mt-1">
            Full Halqa:{" "}
            <Text className="font-semibold text-blue-700">
              {getHalqaPrefix()}
              {halqaNumber}
            </Text>
          </Text>
        )}
      </View>

      {!partyId && (
        <>
          <TouchableOpacity
            onPress={pickSymbol}
            className="bg-purple-600 p-3 rounded mb-2 flex flex-row items-center justify-center"
          >
            <Ionicons name="image" size={20} color="#fff" />
            <Text className="text-white ml-2 font-semibold">
              {symbolUri ? "Change Symbol" : "Upload Symbol"}
            </Text>
          </TouchableOpacity>

          {symbolUri && (
            <Image
              source={{ uri: symbolUri }}
              className="w-24 h-24 rounded self-center mb-4 border"
            />
          )}
        </>
      )}

      <TouchableOpacity
        className="bg-blue-600 py-4 rounded mt-4"
        onPress={handleSubmit}
      >
        <Text className="text-white text-center text-lg font-bold">
          Submit Candidate
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
