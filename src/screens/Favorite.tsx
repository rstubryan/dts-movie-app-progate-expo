import React, { useState, useCallback } from "react";
import { View, Text, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function Favorite() {
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  const getFavoriteMovies = useCallback(async () => {
    const favoriteList =
      JSON.parse((await AsyncStorage.getItem("@FavoriteList")) as string) || [];
    setFavoriteMovies(favoriteList);
  }, []);

  useFocusEffect(
    useCallback(() => {
      getFavoriteMovies();
    }, [getFavoriteMovies]),
  );

  return (
    <View>
      <Text>Favorite Movies:</Text>
      <FlatList
        data={favoriteMovies}
        keyExtractor={(item: number) => item.toString()}
        renderItem={({ item }: { item: number }) => <Text>{item}</Text>}
      />
    </View>
  );
}
