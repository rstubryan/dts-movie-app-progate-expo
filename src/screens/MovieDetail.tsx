import React, { useState, useEffect, useCallback } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MovieDetail = ({ route }: any): JSX.Element => {
  const { id } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  const getFavoriteMovies = useCallback(async () => {
    const favoriteList =
      JSON.parse((await AsyncStorage.getItem("@FavoriteList")) as string) || [];
    setIsFavorite(favoriteList.includes(id));
  }, [id]);

  useEffect(() => {
    getFavoriteMovies();
  }, [getFavoriteMovies]);

  const addFavorite = async () => {
    const favoriteList =
      JSON.parse((await AsyncStorage.getItem("@FavoriteList")) as string) || [];
    favoriteList.push(id);
    await AsyncStorage.setItem("@FavoriteList", JSON.stringify(favoriteList));
    console.log("Added to favorites:", id);
    getFavoriteMovies();
  };

  const removeFavorite = async () => {
    let favoriteList =
      JSON.parse((await AsyncStorage.getItem("@FavoriteList")) as string) || [];
    favoriteList = favoriteList.filter(
      (favoriteId: number) => favoriteId !== id,
    );
    await AsyncStorage.setItem("@FavoriteList", JSON.stringify(favoriteList));
    console.log("Removed from favorites:", id);
    getFavoriteMovies();
  };

  const toggleFavorite = () => {
    isFavorite ? removeFavorite() : addFavorite();
  };

  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        marginTop: 32,
      }}
    >
      <Text style={{ fontSize: 30 }}>Movie ID: {id}</Text>
      <TouchableOpacity onPress={toggleFavorite}>
        <FontAwesome
          name={isFavorite ? "heart" : "heart-o"}
          size={24}
          color="red"
        />
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetail;
