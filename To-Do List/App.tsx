import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  LayoutAnimation,
  UIManager,
} from "react-native";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Index() {
  const [task, setTask] = useState("");
  const [filter, setFilter] = useState<"All" | "Active" | "Completed">("All");
  const [todoList, setTodoList] = useState<
    { id: string; text: string; completed: boolean }[]
  >([]);

  // Animate layout changes
  const animate = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const addTask = () => {
    if (task.trim().length > 0) {
      animate();
      setTodoList([
        { id: Date.now().toString(), text: task, completed: false },
        ...todoList, // Adds new tasks to the top
      ]);
      setTask("");
    }
  };

  const toggleComplete = (id: string) => {
    animate();
    setTodoList(
      todoList.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteTask = (id: string) => {
    animate();
    setTodoList(todoList.filter((item) => item.id !== id));
  };

  // Filter logic
  const filteredTasks = todoList.filter((item) => {
    if (filter === "Active") return !item.completed;
    if (filter === "Completed") return item.completed;
    return true; // "All"
  });

  // Stats logic
  const completedCount = todoList.filter((item) => item.completed).length;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Text style={styles.title}>My Tasks</Text>
        <Text style={styles.subtitle}>
          {completedCount} of {todoList.length} completed
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {["All", "Active", "Completed"].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.activeFilterTab]}
            onPress={() => {
              animate();
              setFilter(f as any);
            }}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.activeFilterText,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List Area */}
      {todoList.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            You have no tasks yet. Add one below!
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.item}>
              {/* Checkbox & Text */}
              <TouchableOpacity
                style={styles.taskContent}
                onPress={() => toggleComplete(item.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    item.completed && styles.checkboxCompleted,
                  ]}
                >
                  {item.completed && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text
                  style={[
                    styles.itemText,
                    item.completed && styles.completedText,
                  ]}
                >
                  {item.text}
                </Text>
              </TouchableOpacity>

              {/* Delete Button */}
              <TouchableOpacity
                onPress={() => deleteTask(item.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="What needs to be done?"
          placeholderTextColor="#999"
          value={task}
          onChangeText={setTask}
          onSubmitEditing={addTask} // Allows hitting "enter" on keyboard to add
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8", // Softer, modern background color
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#EAECEF",
    borderRadius: 12,
    padding: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  activeFilterTab: {
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  activeFilterText: {
    color: "#007AFF",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#999",
    fontStyle: "italic",
  },
  item: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  taskContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#007AFF",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxCompleted: {
    backgroundColor: "#007AFF",
  },
  checkmark: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  itemText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#A0A0A0",
  },
  deleteButton: {
    padding: 8,
    backgroundColor: "#FFF0F0",
    borderRadius: 8,
    marginLeft: 10,
  },
  deleteText: {
    color: "#FF3B30",
    fontWeight: "bold",
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    paddingVertical: 20,
    backgroundColor: "#F4F6F8",
  },
  input: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 30,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  addButton: {
    backgroundColor: "#007AFF",
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 28,
  },
});