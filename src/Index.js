import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, ScrollView, View, SafeAreaView } from "react-native";
import axios from "axios";

export default function ChatGPT() {
  const [inputText, setInputText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleInputChange = (text) => {
    setInputText(text);
  };

  const handleSend = async () => {
    const apiUrl = "https://api.chatgpt.com/v1";
    const apiKey = process.env.REACT_APP_CHATGPT_API_KEY;
    const chatHistoryCopy = [...chatHistory];
    chatHistoryCopy.push({ text: inputText, sender: "user" });
    setChatHistory(chatHistoryCopy);
    const payload = {
      message: inputText,
      context: chatHistoryCopy,
    };
    try {
      const response = await axios.post(`${apiUrl}/chat`, payload, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      chatHistoryCopy.push({ text: response.data.message, sender: "bot" });
      setChatHistory(chatHistoryCopy);
    } catch (error) {
      console.log(error);
    }
    setInputText("");
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.h1}>My chatBot</Text>
          <StatusBar style="auto" />
          {chatHistory.map((chat, index) => (
            <Text key={index}>
              {chat.sender === "user" ? "> " : ""}
              {chat.text}
              {chat.sender === "bot" ? "\n" : ""}
            </Text>
          ))}
          <TextInput
            onChangeText={handleInputChange}
            value={inputText}
            placeholder="Type your message here"
          />
          <Button title="Send" onPress={handleSend} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  h1: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
  },
});
