import React from "react";
import { View, Text } from "react-native";
import RNPickerSelect from "react-native-picker-select";

interface NationalHalqaPickerProps {
  value: string | null;
  onChange: (value: string) => void;
}

const NationalHalqaPicker: React.FC<NationalHalqaPickerProps> = ({
  value,
  onChange,
}) => {
  const naHalqas = Array.from({ length: 266 }, (_, i) => ({
    label: `NA-${i + 1}`,
    value: `NA-${i + 1}`,
  }));

  return (
    <View className="mb-6">
      <Text className="mb-2 font-semibold text-base text-gray-700">
        Select National Halqa (NA)
      </Text>
      <View className="bg-gray-100 rounded-2xl px-2">
        <RNPickerSelect
          onValueChange={(val) => onChange(val)}
          placeholder={{ label: "Select NA Halqa", value: null }}
          items={naHalqas}
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
    </View>
  );
};

export default NationalHalqaPicker;
