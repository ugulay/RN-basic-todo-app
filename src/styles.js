import {
    StyleSheet
} from "react-native";

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

export default styles;