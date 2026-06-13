import React, { useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    Alert,
    Share
} from "react-native";
import { Swipeable } from 'react-native-gesture-handler';
import styles, { Colors } from '../styles';
import i18n from '../i18n';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Todo {
  id: string;
  text: string;
  done: boolean;
  isImportant: boolean;
}

interface TodoListItemProps {
  item: Todo;
  isExpanded: boolean;
  isSelected: boolean;
  isSelectionMode: boolean;
  onToggleExpand: (id: string) => void;
  onToggleDone: (id: string) => void;
  onTogglePriority: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onEnterSelectionMode: (id: string) => void;
  onToggleSelection: (id: string) => void;
}

const TodoListItem: React.FC<TodoListItemProps> = ({
    item,
    isExpanded,
    isSelected,
    isSelectionMode,
    onToggleExpand,
    onToggleDone,
    onTogglePriority,
    onDelete,
    onEdit,
    onEnterSelectionMode,
    onToggleSelection
}) => {
    const swipeableRef = useRef<Swipeable>(null);

    const handlePress = () => {
        if (isSelectionMode) {
            onToggleSelection(item.id);
        } else {
            onToggleExpand(item.id);
        }
    };

    const handleLongPress = () => {
        if (!isSelectionMode) {
            onEnterSelectionMode(item.id);
        }
    };

    const handleShare = async () => {
        try {
            const result = await Share.share({
                message: item.text,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error: any) {
            Alert.alert(error.message);
        }
    };

    const renderLeftActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
        const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [-20, 0, 0, 1],
        });
        return (
            <View style={styles.leftAction}>
                <Animated.View style={[styles.actionContent, { transform: [{ translateX: trans }] }]}>
                    <Icon name={item.done ? 'undo' : 'check'} size={22} color={Colors.onSecondary} />
                    <Text style={styles.actionText}>
                        {item.done ? i18n.t('undo') : i18n.t('done')}
                    </Text>
                </Animated.View>
            </View>
        );
    };

    const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
        const trans = dragX.interpolate({
            inputRange: [-101, -100, -50, 0],
            outputRange: [-1, 0, 0, 20],
        });
        return (
            <View style={styles.rightAction}>
                <Animated.View style={[styles.actionContent, { transform: [{ translateX: trans }] }]}>
                    <Icon name="delete" size={22} color={Colors.onError} />
                    <Text style={styles.actionText}>
                        {i18n.t('delete')}
                    </Text>
                </Animated.View>
            </View>
        );
    };

    return (
        <Swipeable
            ref={swipeableRef}
            renderLeftActions={renderLeftActions}
            renderRightActions={renderRightActions}
            onSwipeableLeftOpen={() => { onToggleDone(item.id); swipeableRef.current?.close(); }}
            onSwipeableRightOpen={() => { onDelete(item.id); swipeableRef.current?.close(); }}
            overshootFriction={8}
            leftThreshold={80} // Updated leftThreshold
            rightThreshold={80} // Updated rightThreshold
        >
            <TouchableOpacity onPress={handlePress} onLongPress={handleLongPress} activeOpacity={0.8}>
                <View style={[styles.task, item.isImportant && styles.taskImportant, item.done && styles.taskDone, isSelected && styles.taskSelected]}>
                    {isExpanded && !isSelectionMode ? (
                        // Expanded View
                        <>
                            <Text style={[styles.expandedText, item.done && styles.taskListTextDone]}>
                                {item.text}
                            </Text>
                            <View style={styles.bottomControlsContainer}>
                                <TouchableOpacity onPress={() => onEdit(item.id)} style={styles.iconButton} accessibilityLabel={i18n.t('edit')}>
                                    <Icon name="edit" size={20} color={styles.editButton.color} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={(e) => { e.stopPropagation(); onTogglePriority(item.id); }} style={styles.iconButton} accessibilityLabel={i18n.t('important')}>
                                    <Icon name={item.isImportant ? "star" : "star-border"} size={20} color={item.isImportant ? Colors.star : Colors.onSurfaceVariant} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleShare} style={styles.iconButton} accessibilityLabel={i18n.t('share')}>
                                    <Icon name="share" size={20} color={styles.editButton.color} />
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        // Collapsed View
                        <View style={styles.collapsedContainer}>
                            <Text
                                style={[styles.collapsedText, item.done && styles.taskListTextDone]}
                                numberOfLines={1}
                                ellipsizeMode='tail'
                            >
                                {item.text}
                            </Text>
                            <TouchableOpacity onPress={(e) => { e.stopPropagation(); onTogglePriority(item.id); }} style={styles.iconButton} accessibilityLabel={i18n.t('important')}>
                                <Icon name={item.isImportant ? "star" : "star-border"} size={20} color={item.isImportant ? Colors.star : Colors.onSurfaceVariant} />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </Swipeable>
    );
}

export default TodoListItem;