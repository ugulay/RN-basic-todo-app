import React, { useState, useEffect } from 'react';
import uuid from 'react-native-uuid';
import storage from '../storage';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Alert
} from "react-native";
import TodoListItem from './TodoListItem';
import styles from '../styles';

const TodoList = () => {

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
                    // done: false, // removed bc. if todo item edited, makes item "undone" again
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

        Alert.alert('Alert', 'Are you sure to clear all items ?', [
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

    return (

        <View style={styles.container}>

            <Text style={styles.title}>TODO</Text>

            <TextInput
                multiline={true}
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
                renderItem={
                    ({ item, index }) => {
                        return <TodoListItem
                            item={item}
                            index={index}
                            handleEditTask={handleEditTask}
                            handleDeleteTask={handleDeleteTask}
                            handleDoneTask={handleDoneTask}
                        />
                    }
                }
                keyExtractor={(item, index) => String(item?.id)}
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

export default TodoList;