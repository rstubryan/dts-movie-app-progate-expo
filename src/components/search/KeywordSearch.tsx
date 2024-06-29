import React, { useState, useEffect } from "react";
import { View, TextInput, FlatList, Text } from "react-native";
import { API_ACCESS_TOKEN } from "@env";

type Movie = {
  id: number;
  title: string;
};

const KeywordSearch = () => {
  const [keyword, setKeyword] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (keyword) {
      searchMovies();
    } else {
      setMovies([]);
      setNotFound(false);
    }
  }, [keyword]);

  const searchMovies = async () => {
    const url = `https://api.themoviedb.org/3/search/movie?query=${keyword}&include_adult=false&language=en-US`;
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
        if (data.results.length > 0) {
          setMovies(data.results);
          setNotFound(false);
        } else {
          setMovies([]);
          setNotFound(true);
        }
      })
      .catch((errorResponse) => {
        console.log(errorResponse);
      });
  };

  const handleInputChange = (text: string) => {
    setKeyword(text);
  };

  return (
    <View>
      <TextInput
        value={keyword}
        onChangeText={handleInputChange}
        placeholder="Search by movie name"
      />
      {notFound && <Text>Movie not found</Text>}
      <FlatList
        data={movies}
        keyExtractor={(item: Movie) => item.id.toString()}
        renderItem={({ item }: { item: Movie }) => <Text>{item.title}</Text>}
      />
    </View>
  );
};

export default KeywordSearch;
