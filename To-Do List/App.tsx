import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const [task, setTask] = useState(""); // Stores what you are typing
  const [todoList, setTodoList] = useState<
    { id: string; text: string; completed: boolean }[]
  >([]); // Stores the list

  // Function to add a new task
  const addTask = () => {
    if (task.trim().length > 0) {
      setTodoList([
        ...todoList,
        { id: Date.now().toString(), text: task, completed: false },
      ]);
      setTask(""); // Clear the input
    }
  };

  // Function to toggle the "line-through"
  const toggleComplete = (id: string) => {
    setTodoList(
      todoList.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Tasks</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write a task..."
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todoList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleComplete(item.id)}>
            <View style={styles.item}>
              <Text
                style={[
                  styles.itemText,
                  item.completed && styles.completedText, // If completed, add line-through style
                ]}
              >
                {item.text}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  addButton: {
    backgroundColor: "#007AFF",
    width: 55,
    marginLeft: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  item: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2, // Adds shadow on Android
  },
  itemText: {
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#AAA", // Gray out the text when finished
  },
});
