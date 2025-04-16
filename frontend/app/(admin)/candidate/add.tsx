import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

export default function AddCandidateScreen() {
  const [name, setName] = useState("");
  const [cnic, setCnic] = useState("");
  const [partyId, setPartyId] = useState("independent");
  const [naHalqa, setNaHalqa] = useState("");
  const [ppHalqa, setPpHalqa] = useState("");
  const [symbol, setSymbol] = useState(null);
  const [parties, setParties] = useState([]);

  const fetchParties = async () => {
    try {
      const res = await fetch("http://192.168.1.9:5000/api/parties");
      const data = await res.json();
      setParties(data);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setSymbol(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (
      !name ||
      !cnic ||
      !naHalqa ||
      !ppHalqa ||
      (partyId === "independent" && !symbol)
    ) {
      return Alert.alert("Validation", "All fields are required");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("cnic", cnic);
    formData.append("party", partyId);
    formData.append("naHalqa", naHalqa);
    formData.append("ppHalqa", ppHalqa);

    if (partyId === "independent") {
      formData.append("symbol", {
        uri: symbol.uri,
        name: "candidate_symbol.jpg",
        type: "image/jpeg",
      });
    }

    try {
      const res = await fetch("http://192.168.1.9:5000/api/candidates", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Success", "Candidate created");
        router.push("/(admin)/candidates");
      } else {
        Alert.alert("Error", data.message || "Failed to create candidate");
      }
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  useEffect(() => {
    fetchParties();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 15,
      }}
      className="flex-1 bg-white px-4 "
    >
      <Text className="text-2xl font-bold text-center text-blue-600 mb-6">
        Add Candidate
      </Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Candidate Name"
        className="bg-gray-100 rounded-2xl px-4 py-3 mb-4"
      />

      <TextInput
        value={cnic}
        onChangeText={setCnic}
        placeholder="CNIC without dashes"
        keyboardType="numeric"
        className="bg-gray-100 rounded-2xl px-4 py-3 mb-4"
      />

      <TextInput
        value={naHalqa}
        onChangeText={setNaHalqa}
        placeholder="NA Halqa"
        className="bg-gray-100 rounded-2xl px-4 py-3 mb-4"
      />

      <TextInput
        value={ppHalqa}
        onChangeText={setPpHalqa}
        placeholder="PP Halqa"
        className="bg-gray-100 rounded-2xl px-4 py-3 mb-4"
      />

      <Text className="mb-2 text-gray-700 font-semibold">Select Party</Text>

      <TouchableOpacity
        className={`p-3 rounded-xl mb-2 ${
          partyId === "independent" ? "bg-blue-200" : "bg-gray-100"
        }`}
        onPress={() => setPartyId("independent")}
      >
        <Text className="text-gray-700 font-semibold">Independent</Text>
      </TouchableOpacity>

      {parties.map((party) => (
        <TouchableOpacity
          key={party._id}
          className={`p-3 rounded-xl mb-2 ${
            partyId === party._id ? "bg-blue-200" : "bg-gray-100"
          }`}
          onPress={() => setPartyId(party._id)}
        >
          <Text className="text-gray-700 font-semibold">{party.name}</Text>
        </TouchableOpacity>
      ))}

      {partyId === "independent" && (
        <>
          <TouchableOpacity
            onPress={pickImage}
            className="bg-gray-200 py-3 px-4 rounded-xl mb-4"
          >
            <Text className="text-gray-800 text-center">
              {symbol ? "Change Symbol" : "Pick Candidate Symbol"}
            </Text>
          </TouchableOpacity>

          {symbol && (
            <Image
              source={{ uri: symbol.uri }}
              style={{
                width: 100,
                height: 100,
                marginBottom: 16,
                alignSelf: "center",
              }}
            />
          )}
        </>
      )}

      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-blue-600 py-4 rounded-2xl"
      >
        <Text className="text-white font-semibold text-center text-lg">
          Create Candidate
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
