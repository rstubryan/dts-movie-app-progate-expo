import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { API_ACCESS_TOKEN } from "@env";
import { Picker } from "@react-native-picker/picker";
import MovieItem from "../movies/MovieItem";
import type { Movie } from "../../types/app";
import { useNavigation } from "@react-navigation/native";

interface Category {
  id: number;
  name: string;
}

type NavigateFunction = (routeName: string, params: { id: number }) => void;

type CoverType = "poster" | "backdrop";

type MovieItemWithPressProps = {
  movie: Movie;
  size: { width: number; height: number; marginBottom: number };
  coverType: CoverType;
};

const CategorySearch = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const getCategories = async () => {
      const url = `https://api.themoviedb.org/3/genre/movie/list`;
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${API_ACCESS_TOKEN}`,
        },
      };

      fetch(url, options)
        .then(async (response) => {
          const data = await response.json();
          setCategories(data.genres);
        })
        .catch((errorResponse) => {
          console.log(errorResponse);
        });
    };

    getCategories();
  }, []);

  const getMoviesByGenre = async (genreId: string) => {
    const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    };

    fetch(url, options)
      .then(async (response) => {
        const data = await response.json();
        setMovies(data.results);
        console.log(data.results);
      })
      .catch((errorResponse) => {
        console.log(errorResponse);
      });
  };

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
    <View style={styles.container}>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => {
          setSelectedCategory(itemValue);
          getMoviesByGenre(itemValue);
        }}
      >
        {categories.map((item) => (
          <Picker.Item key={item.id} label={item.name} value={item.id} />
        ))}
      </Picker>
      {movies.length > 0 && (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MovieItemWithPress
              movie={item}
              size={{ width: 200, height: 300, marginBottom: 10 }}
              coverType="poster"
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginTop: 28,
  },
});

export default CategorySearch;
