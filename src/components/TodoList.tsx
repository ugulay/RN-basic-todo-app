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
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTodos } from '../hooks/useTodos';
import TodoListItem from './TodoListItem';
import styles, { Colors } from '../styles';
import i18n from '../i18n';
import { useNavigation } from '@react-navigation/native';
import { useProgress } from '../hooks/useProgress';
import StreakChip from './StreakChip';
import LevelBadge from './LevelBadge';
import DailyGoalRing from './DailyGoalRing';
import UnlockToast from './UnlockToast';

type Filter = 'ALL' | 'ACTIVE' | 'COMPLETED' | 'IMPORTANT';

const EMPTY_STATE: Record<Filter, { icon: string; title: string; subtitle: string }> = {
    ALL: { icon: 'check-circle-outline', title: 'empty_all_title', subtitle: 'empty_all_subtitle' },
    ACTIVE: { icon: 'done-all', title: 'empty_active_title', subtitle: 'empty_active_subtitle' },
    COMPLETED: { icon: 'inbox', title: 'empty_completed_title', subtitle: 'empty_completed_subtitle' },
    IMPORTANT: { icon: 'star-border', title: 'empty_important_title', subtitle: 'empty_important_subtitle' },
};

const TodoList = () => {
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
    const [filter, setFilter] = useState<Filter>('ALL');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);

    const navigation = useNavigation<any>();
    const { stats, progress } = useProgress();
    const [toastBadge, setToastBadge] = useState<string | null>(null);
    const prevUnlocked = React.useRef(progress.unlockedBadges.length);

    useEffect(() => {
        if (progress.unlockedBadges.length > prevUnlocked.current) {
            setToastBadge(progress.unlockedBadges[progress.unlockedBadges.length - 1]);
        }
        prevUnlocked.current = progress.unlockedBadges.length;
    }, [progress.unlockedBadges]);

    const taskToEdit = editId ? tasks.find(t => t.id === editId) : null;

    useEffect(() => {
        if (editId && taskToEdit) {
            setText(taskToEdit.text);
            setModalVisible(true);
        } else {
            setText('');
        }
    }, [editId, taskToEdit]);

    const completedCount = React.useMemo(() => tasks.filter(t => t.done).length, [tasks]);
    const totalCount = tasks.length;

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

    const isSaveDisabled = text.trim().length === 0;

    const onSaveTask = () => {
        if (isSaveDisabled) return;
        handleAddTask(text.trim());
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

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.headerRow}>
                <StreakChip streak={stats.currentStreak} />
                <View style={styles.headerRight}>
                    <LevelBadge level={stats.level} />
                    <TouchableOpacity
                        style={styles.statsIconBtn}
                        onPress={() => navigation.navigate('Stats')}
                        accessibilityRole="button"
                        accessibilityLabel={i18n.t('stats_title')}
                    >
                        <Icon name="bar-chart" size={22} color={Colors.onSurface} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.titleRow}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>{i18n.t('app_title')}</Text>
                    <Text style={styles.headerSubtitle}>
                        {totalCount > 0
                            ? i18n.t('progress_summary', { done: completedCount, total: totalCount })
                            : i18n.t('no_tasks_yet')}
                    </Text>
                </View>
                <DailyGoalRing done={stats.todayCompleted} goal={stats.dailyGoal} />
            </View>
        </View>
    );

    const renderFilterButton = (value: Filter, label?: string, iconName?: string) => {
        const active = filter === value;
        return (
            <TouchableOpacity
                style={[styles.filterButton, active && styles.activeFilterButton]}
                onPress={() => setFilter(value)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={label ?? i18n.t('important')}
            >
                {iconName ? (
                    <Icon name={iconName} size={18} color={active ? Colors.onPrimary : Colors.star} />
                ) : (
                    <Text style={styles.filterButtonText}>{label}</Text>
                )}
            </TouchableOpacity>
        );
    };

    const renderSelectionBar = () => {
        const allSelected = selectedIds.length === tasks.length;
        return (
            <View style={styles.selectionBar}>
                <TouchableOpacity onPress={exitSelectionMode} accessibilityLabel={i18n.t('cancel')}>
                    <Icon name="close" size={24} color={Colors.onPrimary} />
                </TouchableOpacity>
                <Text style={styles.selectionBarText}>{selectedIds.length} {i18n.t('selected')}</Text>
                <View style={styles.selectionBarActions}>
                    <TouchableOpacity
                        onPress={allSelected ? clearSelection : selectAll}
                        style={styles.selectionIconButton}
                        accessibilityLabel={allSelected ? i18n.t('unselect_all') : i18n.t('select_all')}
                    >
                        <Icon name={allSelected ? 'deselect' : 'select-all'} size={24} color={Colors.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={toggleDoneSelected}
                        style={styles.selectionIconButton}
                        accessibilityLabel={i18n.t('mark_as_done_undo')}
                    >
                        <Icon name="done-all" size={24} color={Colors.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={deleteSelected}
                        style={styles.selectionIconButton}
                        accessibilityLabel={i18n.t('delete')}
                    >
                        <Icon name="delete" size={24} color={Colors.error} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderEmptyState = () => {
        const config = EMPTY_STATE[filter];
        return (
            <View style={styles.emptyContainer}>
                <Icon name={config.icon} size={64} color={Colors.onSurfaceVariant} />
                <Text style={styles.emptyTitle}>{i18n.t(config.title)}</Text>
                <Text style={styles.emptySubtitle}>{i18n.t(config.subtitle)}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                {isSelectionMode ? renderSelectionBar() : (
                    <>
                        {renderHeader()}
                        <View style={styles.filterContainer}>
                            {renderFilterButton('ALL', i18n.t('all'))}
                            {renderFilterButton('ACTIVE', i18n.t('active'))}
                            {renderFilterButton('COMPLETED', i18n.t('completed'))}
                            {renderFilterButton('IMPORTANT', undefined, 'star')}
                        </View>
                    </>
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
                    contentContainerStyle={[
                        { gap: 10 },
                        filteredTasks.length === 0 && { flexGrow: 1 },
                    ]}
                    ListEmptyComponent={isSelectionMode ? null : renderEmptyState()}
                    showsVerticalScrollIndicator={false}
                />

                <Modal
                    transparent={true}
                    visible={isModalVisible}
                    animationType="fade"
                    onRequestClose={closeModal}
                >
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    >
                        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={closeModal}>
                            <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                                <Text style={styles.modalTitle}>{editId ? i18n.t('edit_task') : i18n.t('add_new_task')}</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder={i18n.t('enter_new_task')}
                                    placeholderTextColor={Colors.onSurfaceVariant}
                                    multiline
                                    value={text}
                                    onChangeText={setText}
                                    autoFocus={true}
                                />
                                <TouchableOpacity
                                    style={[styles.modalButton, isSaveDisabled && styles.modalButtonDisabled]}
                                    onPress={onSaveTask}
                                    disabled={isSaveDisabled}
                                    accessibilityRole="button"
                                >
                                    <Text style={[styles.modalButtonText, isSaveDisabled && styles.modalButtonTextDisabled]}>
                                        {editId ? i18n.t('update') : i18n.t('add')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </Modal>

                {!isSelectionMode && (
                    <TouchableOpacity
                        style={styles.floatingActionButton}
                        onPress={openNewTaskModal}
                        accessibilityRole="button"
                        accessibilityLabel={i18n.t('add_new_task')}
                    >
                        <Icon name="add" size={32} color={Colors.onSecondary} />
                    </TouchableOpacity>
                )}

                <UnlockToast badgeId={toastBadge} onHide={() => setToastBadge(null)} />
            </View>
        </SafeAreaView>
    );
};

export default TodoList;
