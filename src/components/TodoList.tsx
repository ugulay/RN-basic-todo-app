import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Alert,
    LayoutAnimation,
    Modal,
    TextInput,
    Share
} from "react-native";
import { useNavigation } from '@react-navigation/native'; // Added import
import { useTodos } from '../hooks/useTodos';
import TodoListItem from './TodoListItem';
import styles from '../styles';
import i18n from '../i18n';

const TodoList = () => {
    const navigation = useNavigation(); // Added useNavigation hook
    const {
        tasks,
        editId,
        setEditId,
        handleAddTask,
        handleTogglePriority,
        handleToggleDone,
        handleDeleteTask,
        // Selection Mode
        isSelectionMode,
        selectedIds,
        enterSelectionMode,
        exitSelectionMode,
        toggleSelection,
        selectAll,
        clearSelection,
        deleteSelected,
        toggleDoneSelected,
    } = useTodos();

    const [text, setText] = useState('');
    const [filter, setFilter] = useState('ALL');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);

    const taskToEdit = editId ? tasks.find(t => t.id === editId) : null;

    useEffect(() => {
        if (editId && taskToEdit) {
            setText(taskToEdit.text);
            setModalVisible(true);
        } else {
            setText('');
        }
    }, [editId, taskToEdit]);

    const filteredTasks = React.useMemo(() => {
        const sortedTasks = [...tasks].sort((a, b) => (Number(b.isImportant) - Number(a.isImportant)));
        switch (filter) {
            case 'ACTIVE':
                return sortedTasks.filter(t => !t.done);
            case 'COMPLETED':
                return sortedTasks.filter(t => t.done);
            case 'IMPORTANT':
                return sortedTasks.filter(t => t.isImportant);
            default:
                return sortedTasks;
        }
    }, [tasks, filter]);

    const onSaveTask = () => {
        handleAddTask(text);
        closeModal();
    };

    const openNewTaskModal = () => {
        setEditId(null);
        setText('');
        setModalVisible(true);
    }

    const closeModal = () => {
        setModalVisible(false);
        setEditId(null);
    }

    const handleToggleExpand = (id: string) => {
        if (isSelectionMode) return; // Don't expand in selection mode
        LayoutAnimation.easeInEaseOut();
        setExpandedId(currentId => (currentId === id ? null : id));
    };

    const confirmDeleteTask = (id: string) => {
        Alert.alert(i18n.t('delete_task'), i18n.t('are_you_sure_delete_task'), [
            { text: i18n.t('cancel'), style: 'cancel' },
            { text: i18n.t('delete'), onPress: () => handleDeleteTask(id), style: 'destructive' },
        ]);
    };

    const SelectionBar = () => (
        <View style={styles.selectionBar}>
            <TouchableOpacity onPress={exitSelectionMode}>
                <Text style={styles.selectionBarText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.selectionBarText}>{selectedIds.length} {i18n.t('selected')}</Text>
            <View style={styles.selectionBarActions}>
                <TouchableOpacity onPress={selectedIds.length === tasks.length ? clearSelection : selectAll}>
                    <Text style={styles.selectionActionButton}>{selectedIds.length === tasks.length ? i18n.t('unselect_all') : i18n.t('select_all')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleDoneSelected}>
                    <Text style={styles.selectionActionButton}>{i18n.t('mark_as_done_undo')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={deleteSelected}>
                    <Text style={styles.selectionActionButton}>{i18n.t('delete')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {isSelectionMode ? <SelectionBar /> : (
                <View style={styles.filterContainer}>
                    <TouchableOpacity style={[styles.filterButton, filter === 'ALL' && styles.activeFilterButton]} onPress={() => setFilter('ALL')}><Text style={styles.filterButtonText}>{i18n.t('all')}</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.filterButton, filter === 'ACTIVE' && styles.activeFilterButton]} onPress={() => setFilter('ACTIVE')}><Text style={styles.filterButtonText}>{i18n.t('active')}</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.filterButton, filter === 'COMPLETED' && styles.activeFilterButton]} onPress={() => setFilter('COMPLETED')}><Text style={styles.filterButtonText}>{i18n.t('completed')}</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.filterButton, filter === 'IMPORTANT' && styles.activeFilterButton]} onPress={() => setFilter('IMPORTANT')}><Text style={styles.filterButtonText}>★</Text></TouchableOpacity>
                </View>
            )}

            <FlatList
                data={filteredTasks}
                renderItem={({ item }) => (
                    <TodoListItem
                        item={item}
                        isExpanded={item.id === expandedId}
                        isSelected={selectedIds.includes(item.id)}
                        isSelectionMode={isSelectionMode}
                        onToggleExpand={handleToggleExpand}
                        onToggleDone={() => handleToggleDone(item.id)}
                        onTogglePriority={() => handleTogglePriority(item.id)}
                        onDelete={() => confirmDeleteTask(item.id)}
                        onEdit={() => setEditId(item.id)}
                        onEnterSelectionMode={() => enterSelectionMode(item.id)}
                        onToggleSelection={toggleSelection}
                    />
                )}
                keyExtractor={(item) => item.id}
                extraData={{ expandedId, selectedIds, isSelectionMode }} // Ensures re-render on all state changes
                contentContainerStyle={{ gap: 10 }} // Added gap
            />

            <Modal
                transparent={true}
                visible={isModalVisible}
                animationType="fade"
                onRequestClose={closeModal}
            >
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={closeModal}>
                    <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                        <Text style={styles.modalTitle}>{editId ? i18n.t('edit_task') : i18n.t('add_new_task')}</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder={i18n.t('enter_new_task')}
                            multiline
                            value={text}
                            onChangeText={setText}
                            autoFocus={true}
                        />
                        <TouchableOpacity style={styles.modalButton} onPress={onSaveTask}>
                            <Text style={styles.modalButtonText}>{editId ? i18n.t('update') : i18n.t('add')}</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>


            {!isSelectionMode && (
                <TouchableOpacity style={styles.floatingActionButton} onPress={openNewTaskModal}>
                    <Text style={styles.fabText}>+</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default TodoList;
