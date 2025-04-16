// app/index.js
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function IndexPage() {
  const [username, setUsername] = useState("");
  const [cnic, setCnic] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setUsername(user?.name || "User");
        setCnic(user?.cnic || "");
        setRole(user?.role || "voter");
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    return null; // Optional: loading spinner or splash
  }

  // Redirect based on role
  if (username && cnic) {
    if (role === "admin") {
      return <Redirect href="/(admin)/dashboard" />;
    } else {
      return <Redirect href="/(tabs)/home" />;
    }
  }

  return <Redirect href="/(auth)/login" />;
}
