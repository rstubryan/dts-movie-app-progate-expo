import React, { useEffect, useState } from "react";
import { View, TextInput, FlatList, Text } from "react-native";
import { API_ACCESS_TOKEN } from "@env";

interface Category {
  id: number;
  name: string;
}

const CategorySearch = () => {
  const [categories, setCategories] = useState<Category[]>([]);

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

  return (
    <View>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text>{item.name}</Text>}
      />
    </View>
  );
};

export default CategorySearch;
