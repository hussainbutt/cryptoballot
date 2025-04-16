import React from "react";
import { View, Text } from "react-native";
import RNPickerSelect from "react-native-picker-select";

type ProvinceCode = "PP" | "PS" | "PK" | "PB" | null;

interface ProvincialHalqaPickerProps {
  province: ProvinceCode;
  setProvince: (province: ProvinceCode) => void;
  value: string | null;
  onChange: (value: string) => void;
}

const halqaLimits: Record<Exclude<ProvinceCode, null>, number> = {
  PP: 297,
  PS: 130,
  PK: 115,
  PB: 51,
};

const provinces = [
  { label: "Punjab Assembly", value: "PP" },
  { label: "Sindh Assembly", value: "PS" },
  { label: "KP Assembly", value: "PK" },
  { label: "Balochistan Assembly", value: "PB" },
];

const ProvincialHalqaPicker: React.FC<ProvincialHalqaPickerProps> = ({
  province,
  setProvince,
  value,
  onChange,
}) => {
  const getHalqas = (code: ProvinceCode) => {
    if (!code) return [];
    const limit = halqaLimits[code];
    return Array.from({ length: limit }, (_, i) => ({
      label: `${code}-${i + 1}`,
      value: `${code}-${i + 1}`,
    }));
  };

  return (
    <View className="mb-4">
      <Text className="mb-2 font-semibold text-base text-gray-700">
        Select Province
      </Text>
      <View className="bg-gray-100 rounded-2xl px-2 mb-4">
        <RNPickerSelect
          onValueChange={(val: ProvinceCode) => {
            setProvince(val);
            onChange(""); // Reset halqa when province changes
          }}
          placeholder={{ label: "Select Province", value: null }}
          items={provinces}
          value={province}
          style={{
            inputIOS: {
              height: 50,
              paddingHorizontal: 10,
              color: "black",
            },
            inputAndroid: {
              height: 50,
              paddingHorizontal: 10,
              color: "black",
            },
            placeholder: {
              color: "gray",
            },
          }}
        />
      </View>

      {province && (
        <>
          <Text className="mb-2 font-semibold text-base text-gray-700">
            Select Provincial Halqa ({province})
          </Text>
          <View className="bg-gray-100 rounded-2xl px-2">
            <RNPickerSelect
              onValueChange={(val) => onChange(val)}
              placeholder={{ label: "Select Halqa", value: null }}
              items={getHalqas(province)}
              value={value}
              style={{
                inputIOS: {
                  height: 50,
                  paddingHorizontal: 10,
                  color: "black",
                },
                inputAndroid: {
                  height: 50,
                  paddingHorizontal: 10,
                  color: "black",
                },
                placeholder: {
                  color: "gray",
                },
              }}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default ProvincialHalqaPicker;
