import React, { useState, useCallback } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { API_ACCESS_TOKEN } from "@env";
import MovieItem from "../components/movies/MovieItem";
import type { Movie } from "../types/app";

type NavigateFunction = (routeName: string, params: { id: number }) => void;

type CoverType = "poster" | "backdrop";

type MovieItemWithPressProps = {
  movie: Movie;
  size: { width: number; height: number; marginBottom: number };
  coverType: CoverType;
};

export default function Favorite() {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const navigation = useNavigation();

  const getFavoriteMovies = useCallback(async () => {
    const favoriteList =
      JSON.parse((await AsyncStorage.getItem("@FavoriteList")) as string) || [];

    const favoriteMovies = await Promise.all(
      favoriteList.map(async (movieId: number) => {
        const url = `https://api.themoviedb.org/3/movie/${movieId}`;
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${API_ACCESS_TOKEN}`,
          },
        };

        const response = await fetch(url, options);
        const movie = await response.json();
        return movie;
      }),
    );

    setFavoriteMovies(favoriteMovies);
  }, []);

  useFocusEffect(
    useCallback(() => {
      getFavoriteMovies();
    }, [getFavoriteMovies]),
  );

  const MovieItemWithPress: React.FC<MovieItemWithPressProps> = ({
    movie,
    size,
    coverType,
  }) => (
    <TouchableOpacity
      onPress={() => {
        (navigation.navigate as NavigateFunction)("MovieDetail", {
          id: movie.id,
        });
      }}
    >
      <View pointerEvents="none">
        <MovieItem
          movie={movie as Movie}
          size={size}
          coverType={coverType as CoverType}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ marginTop: 64, margin: 16, flex: 1 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 16,
          textAlign: "center",
        }}
      >
        Favorite Movies
      </Text>
      {favoriteMovies.length === 0 ? (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Text style={{ textAlign: "center" }}>
            You have no favorite movies yet.
          </Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ paddingBottom: 280 }}
          numColumns={3}
          data={favoriteMovies}
          renderItem={({ item }) => (
            <MovieItemWithPress
              movie={item}
              size={{ width: 117, height: 160, marginBottom: 4 }} // Adjust size as needed
              coverType="poster" // Adjust coverType as needed
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
}
