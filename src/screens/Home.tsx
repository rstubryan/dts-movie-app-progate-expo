import React from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Home: undefined;
  MovieDetail: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, "Home">;

export default function Home() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home</Text>
      <Button
        title="Go to Movie Detail"
        onPress={() => navigation.navigate("MovieDetail")}
      />
    </View>
  );
}
