import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export const handleLogout = async () => {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("user");
    router.replace("/(auth)/login");
};

export const getUserInfo = async () => {
    const storedUser = await AsyncStorage.getItem("user");
    if (storedUser) {
        const user = JSON.parse(storedUser);
        console.log("Logged in user:", user);
        return user;
    }
    return null;
};

export const saveUserSession = async (token, user) => {
    await AsyncStorage.setItem("authToken", token);
    await AsyncStorage.setItem("userInfo", JSON.stringify(user));
};
