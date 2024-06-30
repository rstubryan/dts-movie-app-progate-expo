import React, { useState, useEffect, useCallback } from "react";
import { Text, View, TouchableOpacity, ImageBackground } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MovieList from "../components/movies/MoviesList";
import { API_ACCESS_TOKEN } from "@env";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native";

interface Movie {
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  runtime: number;
  release_date: string;
  genres: { id: number; name: string }[];
  spoken_languages: { english_name: string }[];
}

const MovieDetail = ({ route }: any): JSX.Element => {
  const { id } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [recommendations, setRecommendations] = useState([]);
  const navigation = useNavigation();

  const getFavoriteMovies = useCallback(async () => {
    const favoriteList =
      JSON.parse((await AsyncStorage.getItem("@FavoriteList")) as string) || [];
    setIsFavorite(favoriteList.includes(id));
  }, [id]);

  const fetchMovie = async () => {
    const url = `https://api.themoviedb.org/3/movie/${id}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    };

    fetch(url, options)
      .then(async (response) => await response.json())
      .then((data) => {
        setMovie(data);
      })
      .catch((errorResponse) => {
        console.log(errorResponse);
      });
  };

  const fetchRecommendations = async () => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/recommendations`,
    );
    const data = await response.json();
    setRecommendations(data.results);
  };

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

  useEffect(() => {
    getFavoriteMovies();
    fetchMovie();
    fetchRecommendations();
  }, [getFavoriteMovies]);

  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        marginTop: 49,
      }}
    >
      {movie && (
        <>
          <ImageBackground
            resizeMode="cover"
            style={{
              width: "100%",
              height: 200,
              marginBottom: 16,
            }}
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
            }}
          >
            <LinearGradient
              colors={["#00000000", "rgba(0, 0, 0, 0.7)"]}
              locations={[0.6, 0.8]}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: 200,
                padding: 8,
                justifyContent: "flex-end",
                borderRadius: 8,
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                }}
              >
                <FontAwesome name="chevron-left" size={20} color="white" />
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: 8,
                }}
              >
                <View>
                  <Text
                    style={{ fontSize: 24, fontWeight: "bold", color: "white" }}
                  >
                    {movie.title}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <FontAwesome name="star" size={16} color="yellow" />
                    <Text
                      style={{
                        fontSize: 16,
                        color: "yellow",
                        fontWeight: "700",
                      }}
                    >
                      {movie.vote_average.toFixed(1)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={toggleFavorite}
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <FontAwesome
                    name={isFavorite ? "heart" : "heart-o"}
                    size={24}
                    color="red"
                  />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </ImageBackground>
          <ScrollView
            style={{
              marginBottom: 16,
              paddingLeft: 16,
              paddingRight: 16,
            }}
            contentContainerStyle={{ paddingBottom: 220 }}
          >
            <View style={{ marginBottom: 4 }}>
              <Text
                style={{ fontSize: 14, fontWeight: "bold", marginBottom: 4 }}
              >
                Genre
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
                {movie.genres.map((genre, index) => (
                  <Text
                    key={index}
                    style={{
                      fontSize: 14,
                      backgroundColor: "white",
                      padding: 4,
                      paddingLeft: 10,
                      paddingRight: 10,
                      borderRadius: 25,
                      marginRight: 4,
                      marginBottom: 4,
                    }}
                  >
                    {genre.name}
                  </Text>
                ))}
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                  Runtime
                </Text>
                <Text style={{ fontSize: 14 }}>
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </Text>
              </View>
              <View style={{ marginBottom: 4 }}>
                <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                  Release Date
                </Text>
                <Text style={{ fontSize: 14 }}>{movie.release_date}</Text>
              </View>
              <View style={{ marginBottom: 4 }}>
                <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                  Language
                </Text>
                <Text style={{ fontSize: 14 }}>
                  {movie.spoken_languages[0]?.english_name || "-"}
                </Text>
              </View>
            </View>
            <Text
              style={{
                fontSize: 14,
                textAlign: "justify",
                lineHeight: 20,
                paddingBottom: 16,
              }}
            >
              {movie.overview}
            </Text>
            <MovieList
              title="Recommendations"
              coverType="poster"
              path={`movie/${id}/recommendations`}
            />
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default MovieDetail;
