import React, { useState, useEffect } from 'react';
import uuid from 'react-native-uuid';
import { MMKV } from 'react-native-mmkv'
export const storage = new MMKV();
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Alert
} from "react-native";

const App = () => {

    const [task, setTask] = useState({
        id: null,
        date: null,
        done: false,
        text: null
    });

    const [tasks, setTasks] = useState([]);

    const [editIndex, setEditIndex] = useState(-1);

    const loadNotes = async () => new Promise((resolve, reject) => {
        try {
            setTasks([]);
            const notes = storage?.getAllKeys();
            console.log("NOTE FOUND:" + notes?.length);
            if (notes.length > 0) {
                setTasks(notes.map(i => {
                    return JSON.parse(storage?.getString(i));
                }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            return resolve(true);
        }
    });

    const clearAllNotes = async () => new Promise((resolve, reject) => {
        try {
            return resolve(
                storage.clearAll()
            );
        } catch (err) {
            console.error(err);
        } finally {
            return resolve(true);
        }
    });

    const setNote = async (id, data) => new Promise((resolve, reject) => {
        try {
            console.log({ id, data });
            return resolve(
                storage.set(id, JSON.stringify(data))
            );
        } catch (err) {
            console.error(err);
        } finally {
            return resolve(true);
        }
    });

    const deleteNote = async (id) => new Promise((resolve, reject) => {
        try {
            return resolve(
                storage.delete(id)
            );
        } catch (err) {
            console.error(err);
        } finally {
            return resolve(true);
        }
    });

    const resetTaskData = () => {
        setTask({
            id: null,
            date: null,
            done: false,
            text: null
        });
    }

    const handleAddTask = async () => {
        if (task) {
            if (editIndex !== -1) {

                // Edit existing task 

                const taskDataUpdated = {
                    id: editIndex,
                    date: new Date(),
                    done: false,
                    text: task?.text
                }

                await setNote(String(taskDataUpdated?.id), taskDataUpdated);
                await loadNotes();

                setEditIndex(-1);

            } else {
                // Add new task 
                const taskData = {
                    id: uuid.v4(),
                    date: new Date(),
                    done: false,
                    text: task.text
                }

                await setNote(taskData?.id, taskData);
                await loadNotes();

            }

            resetTaskData();

        }
    };

    const handleEditTask = async (item) => {
        setTask(item);
        setEditIndex(item?.id);
    };

    const handleDoneTask = async (item) => {

        let taskDataUpdated = {
            ...item,
            done: item?.done === true ? false : true
        }

        await setNote(String(taskDataUpdated?.id), taskDataUpdated);
        await loadNotes();

    };

    const handleDeleteTask = async (index) => {

        Alert.alert('Alert', 'Are you sure to delete this item ?', [
            {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
            },
            {
                text: 'YES!', onPress: async () => {
                    await deleteNote(String(index));
                    await loadNotes();
                }
            },
        ]);

    };

    const handleDeleteAllTask = async () => {

        Alert.alert('Alert Title', 'Are you sure to clear all items ?', [
            {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
            },
            {
                text: 'YES!', onPress: async () => {
                    await clearAllNotes();
                    await loadNotes();
                }
            },
        ]);

    }

    const cancelEdit = async () => {
        setEditIndex(-1);
        resetTaskData();
    }

    useEffect(() => {
        loadNotes();
    }, []);

    const renderItem = ({ item, index }) => (

        <View style={styles.task}>

            <Text style={item?.done === false ? styles.taskListText : styles.taskListTextDone}>{item?.text}</Text>

            <View style={styles.taskButtons}>

                <TouchableOpacity
                    onPress={() => handleDoneTask(item)}>
                    <Text style={styles.doneButton}>{
                        item?.done === false ? 'Done' : 'Undone'
                    }</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleEditTask(item)}>
                    <Text style={styles.editButton}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleDeleteTask(item?.id)}>
                    <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>

            </View>

        </View>

    );

    return (

        <View style={styles.container}>

            <Text style={styles.title}>TODO</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter"
                value={task?.text}
                onChangeText={(text) => setTask({ text: text })}
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddTask}>
                <Text style={styles.addButtonText}>{editIndex !== -1 ? "Update" : "Add"}</Text>
            </TouchableOpacity>

            {editIndex !== -1 &&
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={cancelEdit}>
                    <Text style={styles.addButtonText}>Cancel</Text>
                </TouchableOpacity>
            }

            <FlatList
                data={tasks}
                renderItem={renderItem}
                keyExtractor={(item, index) => {
                    return String(item?.id);
                }}
            />

            <TouchableOpacity
                onPress={() => handleDeleteAllTask()} style={{
                    marginLeft: "auto"
                }}>
                <Text style={styles.deleteButton}>Delete All</Text>
            </TouchableOpacity>

        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    heading: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 7,
        color: "green",
    },
    input: {
        borderWidth: 2,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 5,
        borderRadius: 5,
        fontSize: 16,
    },
    addButton: {
        backgroundColor: "green",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    addButtonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16,
    },
    task: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
        alignItems: "center",
        marginBottom: 5,
        padding: 5,
        paddingRight: 0,
        fontSize: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    taskListText: {
        fontSize: 18,
        maxWidth: '60%',
    },
    taskListTextDone: {
        fontSize: 18,
        maxWidth: '60%',
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid'
    },
    taskButtons: {
        flexDirection: "row",
        maxWidth: '40%'
    },
    editButton: {
        marginRight: 10,
        color: "green",
        fontWeight: "bold",
        fontSize: 16,
    },
    doneButton: {
        marginRight: 10,
        color: "blue",
        fontWeight: "bold",
        fontSize: 16,
    },
    deleteButton: {
        color: "red",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default App;