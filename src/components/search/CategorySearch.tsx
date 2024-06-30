import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { API_ACCESS_TOKEN } from "@env";
import { Picker } from "@react-native-picker/picker";
import MovieItem from "../movies/MovieItem";
import type { Movie } from "../../types/app";

interface Category {
  id: number;
  name: string;
}

const CategorySearch = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);

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
      })
      .catch((errorResponse) => {
        console.log(errorResponse);
      });
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => {
          setSelectedCategory(itemValue);
          getMoviesByGenre(itemValue);
          Alert.alert(`Selected genre id is: ${itemValue}`); // Menampilkan id genre yang dipilih
        }}
      >
        {categories.map((item) => (
          <Picker.Item key={item.id} label={item.name} value={item.id} />
        ))}
      </Picker>
      <FlatList
        data={movies}
        renderItem={({ item }) => (
          <MovieItem
            movie={item}
            size={{ width: 100, height: 160 }}
            coverType="poster"
          />
        )}
        keyExtractor={(item: Movie) => item.id.toString()}
      />
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
