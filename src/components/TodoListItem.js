import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from "react-native";
import styles from '../styles';

const TodoListItem = ({
    item, index,
    handleEditTask,
    handleDoneTask,
    handleDeleteTask
}) => {

    return (

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

}

export default TodoListItem;