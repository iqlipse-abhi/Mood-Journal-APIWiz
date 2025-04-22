import React from "react";
import { fetchData } from "./api";
import { useEffect, useState } from "react";

const emojisList = () => {
  const [emojis, setEmojis] = useState([]);
  useEffect(() => {
    async function fetchDataFromApi() {
      try {
        const result = await fetchData("emojis/all");
        setEmojis(result);
      } catch (error) {
        console.log("Failed to fetch data from API");
      }
    }

    fetchDataFromApi();
  }, []);

  const emojisList = [];
  emojis.forEach((emoji) => {
    switch (emoji.name) {
      case "happy":
        emojisList.push({ id: emoji.id1, emoji: "😊" });
        break;
      case "sad":
        emojisList.push({ id: emoji.id2, emoji: "😢" });
        break;
      case "angry":
        emojisList.push({ id: emoji.id3, emoji: "😡" });
        break;
      case "sleepy":
        emojisList.push({ id: emoji.id4, emoji: "😴" });
        break;
      case "superhappy":
        emojisList.push({ id: emoji.id5, emoji: "😁" });
        break;
      default:
        emojisList.push({ id: emoji.id6, emoji: "😐" });
        break;
    }
  });

  return emojisList;
};

export default emojisList;
