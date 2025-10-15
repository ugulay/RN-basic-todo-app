import React, { useState, useEffect, useMemo } from 'react';
import { LayoutAnimation } from 'react-native';
import uuid from 'react-native-uuid';
import storage from '../storage';

interface Task {
  id: string;
  text: string;
  date: Date;
  done: boolean;
  isImportant: boolean;
}

export const useTodos = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [editId, setEditId] = useState<string | null>(null);
    const [isSelectionMode, setSelectionMode] = useState<boolean>(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        try {
            const allKeys = storage?.getAllKeys() || [];
            const todoKeys = allKeys.filter(key => !key.startsWith('reminder-')); // Filter out reminder keys
            if (todoKeys.length > 0) {
                const loadedTasks = todoKeys.map(id => JSON.parse(storage?.getString(id) || 'null')).filter(Boolean);
                setTasks(loadedTasks);
            } else {
                setTasks([]);
            }
        } catch (err) {
            console.error("Failed to load notes", err);
        }
    };

    const handleAddTask = async (text: string) => {
        if (!text) return;
        LayoutAnimation.spring();
        if (editId) {
            const taskToUpdate = tasks.find(t => t.id === editId);
            if (taskToUpdate) {
                const updatedTask = { ...taskToUpdate, text, date: new Date() };
                storage.set(editId, JSON.stringify(updatedTask));
            }
        } else {
            const newTask = { id: uuid.v4(), text, date: new Date(), done: false, isImportant: false };
            storage.set(newTask.id, JSON.stringify(newTask));
        }
        await loadNotes();
        setEditId(null);
    };

    const handleTogglePriority = async (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            const updatedTask = { ...task, isImportant: !task.isImportant };
            LayoutAnimation.spring();
            storage.set(id, JSON.stringify(updatedTask));
            await loadNotes();
        }
    };

    const handleToggleDone = async (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            const updatedTask = { ...task, done: !task.done };
            LayoutAnimation.spring();
            storage.set(id, JSON.stringify(updatedTask));
            await loadNotes();
        }
    };

    const handleDeleteTask = async (id: string) => {
        LayoutAnimation.spring();
        storage.delete(id);
        await loadNotes();
    };

    // --- Multi-Select Functions ---
    const enterSelectionMode = (id: string) => {
        setSelectionMode(true);
        setSelectedIds([id]);
    };

    const exitSelectionMode = () => {
        setSelectionMode(false);
        setSelectedIds([]);
    };

    const toggleSelection = (id: string) => {
        const newSelectedIds = selectedIds.includes(id)
            ? selectedIds.filter(selectedId => selectedId !== id)
            : [...selectedIds, id];

        if (newSelectedIds.length === 0) {
            exitSelectionMode();
        } else {
            setSelectedIds(newSelectedIds);
        }
    };

    const selectAll = () => {
        setSelectedIds(tasks.map(t => t.id));
    };

    const clearSelection = () => {
        setSelectedIds([]);
    };

    const deleteSelected = async () => {
        LayoutAnimation.spring();
        selectedIds.forEach(id => storage.delete(id));
        await loadNotes();
        exitSelectionMode();
    };

    const toggleDoneSelected = async () => {
        LayoutAnimation.spring();
        const firstSelectedTask = tasks.find(t => t.id === selectedIds[0]);
        const newDoneStatus = firstSelectedTask ? !firstSelectedTask.done : true;
        selectedIds.forEach(id => {
            const task = tasks.find(t => t.id === id);
            if (task) {
                const updatedTask = { ...task, done: newDoneStatus };
                storage.set(id, JSON.stringify(updatedTask));
            }
        });
        await loadNotes();
        exitSelectionMode();
    };

    return {
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
    };
};