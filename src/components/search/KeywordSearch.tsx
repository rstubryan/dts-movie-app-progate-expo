import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { API_ACCESS_TOKEN } from "@env";
import MovieItem from "../movies/MovieItem";
import { useNavigation } from "@react-navigation/native";
import type { Movie } from "../../types/app";

type NavigateFunction = (routeName: string, params: { id: number }) => void;

type CoverType = "poster" | "backdrop";

type MovieItemWithPressProps = {
  movie: Movie;
  size: { width: number; height: number; marginBottom: number };
  coverType: CoverType;
};

const KeywordSearch = () => {
  const navigation = useNavigation();
  const [keyword, setKeyword] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [notFound, setNotFound] = useState(false);
  const abortController = useRef(new AbortController());
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const coverImageSize = {
    poster: {
      width: 117,
      height: 160,
      marginBottom: 4,
    },
  };

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
      signal: abortController.current.signal,
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
      .catch(() => {});
  };

  const handleInputChange = (text: string) => {
    setKeyword(text);
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
        contentContainerStyle={{ paddingBottom: 280 }}
        numColumns={3}
        data={movies}
        renderItem={({ item }) => (
          <MovieItemWithPress
            movie={item}
            size={coverImageSize.poster}
            coverType="poster"
          />
        )}
        keyExtractor={(item: Movie) => item.id.toString()}
      />
    </View>
  );
};

export default KeywordSearch;
