import React, { useState, useEffect, useRef } from "react";
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
  const abortController = useRef(new AbortController());
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      if (keyword) {
        searchMovies();
      } else {
        setMovies([]);
        setNotFound(false);
      }
    }, 300);

    // Cleanup function to cancel ongoing fetch request
    return () => {
      abortController.current.abort();
      abortController.current = new AbortController();
    };
  }, [keyword]);

  const searchMovies = async () => {
    const url = `https://api.themoviedb.org/3/search/movie?query=${keyword}&include_adult=false&language=en-US`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
      signal: abortController.current.signal, // Pass the abort signal to the fetch request
    };

    fetch(url, options)
      .then(async (response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        if (data.results.length > 0) {
          setMovies(data.results);
          setNotFound(false);
        } else {
          setMovies([]);
          setNotFound(true);
        }
      })
      .catch((error) => {});
  };

  const handleInputChange = (text: string) => {
    setKeyword(text);
  };

  return (
    <View>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          backgroundColor: "white",
          marginTop: 10,
          marginBottom: 10,
          padding: 10,
          borderRadius: 25,
        }}
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
