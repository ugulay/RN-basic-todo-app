import {
    StyleSheet
} from "react-native";

const Colors = {
    primary: '#BB86FC',
    primaryVariant: '#3700B3',
    secondary: '#03DAC6',
    background: '#121212',
    surface: '#282828',
    error: '#CF6679',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
    onSurfaceVariant: '#B0B0B0',
    onError: '#000000',
    star: '#FFD700',
};

export { Colors };

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 15,
    },

    // Header
    header: {
        marginBottom: 18,
    },
    headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.onBackground,
    },
    headerSubtitle: {
        fontSize: 13,
        color: Colors.onSurfaceVariant,
    },
    progressBarTrack: {
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.surface,
        marginTop: 12,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.secondary,
    },

    // Empty State
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 30,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.onBackground,
        marginTop: 16,
        marginBottom: 6,
    },
    emptySubtitle: {
        fontSize: 14,
        color: Colors.onSurfaceVariant,
        textAlign: 'center',
        lineHeight: 20,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
        backgroundColor: Colors.surface,
        borderRadius: 10,
        padding: 5,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 15,
        backgroundColor: Colors.surface,
    },
    activeFilterButton: {
        backgroundColor: Colors.primary,
    },
    filterButtonText: {
        color: Colors.onSurface,
        fontWeight: 'bold',
    },
    // Task Item General Style
    task: {
        backgroundColor: Colors.surface,
        padding: 15,
        borderRadius: 10,
        minHeight: 50,
        marginBottom: 10,
    },
    taskImportant: {
        backgroundColor: Colors.primaryVariant,
    },
    taskDone: {
        backgroundColor: '#1A2424',
        opacity: 0.7,
    },
    taskSelected: {
        backgroundColor: Colors.primaryVariant,
        borderColor: Colors.secondary,
        borderWidth: 2,
    },

    // Collapsed State Styles
    collapsedContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 50,
    },
    collapsedText: {
        fontSize: 16,
        color: Colors.onSurface,
        flex: 1,
        marginRight: 10,
    },

    // Expanded State Styles
    expandedText: {
        fontSize: 16,
        color: Colors.onSurface,
        marginBottom: 15,
    },
    bottomControlsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    editButton: {
        color: Colors.secondary,
        fontWeight: "bold",
        fontSize: 16,
    },
    iconButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: Colors.surface,
        marginLeft: 10,
    },

    // Shared Styles
    taskListTextDone: {
        color: '#888888',
        textDecorationLine: 'line-through',
    },
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badgeButton: {
        fontSize: 18,
    },
    priorityButton: {
        color: '#888888',
    },
    priorityButtonImportant: {
        color: '#FFD700',
    },
    doneButton: {
        color: Colors.secondary,
    },
    deleteButton: {
        color: Colors.error,
    },

    // FAB and Modal Styles
    floatingActionButton: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 20,
        backgroundColor: Colors.secondary,
        borderRadius: 30,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    fabText: {
        fontSize: 30,
        color: Colors.onSecondary,
        lineHeight: 30,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: Colors.surface,
        borderRadius: 15,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.onSurface,
        marginBottom: 20,
    },
    modalInput: {
        backgroundColor: '#2C2C2C',
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        fontSize: 16,
        color: Colors.onSurface,
        height: 120,
        textAlignVertical: 'top',
    },
    modalButton: {
        backgroundColor: Colors.secondary,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalButtonDisabled: {
        backgroundColor: '#2C2C2C',
    },
    modalButtonText: {
        color: Colors.onSecondary,
        fontWeight: "bold",
        fontSize: 18,
    },
    modalButtonTextDisabled: {
        color: '#666',
    },

    // Selection Mode Action Bar
    selectionBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.primaryVariant,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 10,
        borderRadius: 10,
    },
    selectionBarActions: {
        flexDirection: 'row',
    },
    selectionBarText: {
        color: Colors.onPrimary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    selectionActionButton: {
        color: Colors.secondary,
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 20,
    },
    selectionIconButton: {
        marginLeft: 22,
    },

    // Swipeable Actions
    leftAction: {
        backgroundColor: Colors.secondary,
        justifyContent: 'center',
        alignItems: 'flex-start',
        flex: 1,
        minHeight: 50,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    rightAction: {
        backgroundColor: Colors.error,
        justifyContent: 'center',
        alignItems: 'flex-end',
        flex: 1,
        minHeight: 50,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    actionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    actionText: {
        color: Colors.onError,
        fontWeight: '600',
        marginLeft: 8,
        fontSize: 16,
    },

    // Gamified header
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    streakChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Colors.surface,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 14,
    },
    streakFlame: { fontSize: 15 },
    streakNum: { color: Colors.onSurface, fontWeight: 'bold', fontSize: 14 },
    levelBadge: {
        backgroundColor: Colors.star,
        color: '#000',
        fontSize: 12,
        fontWeight: 'bold',
        paddingVertical: 3,
        paddingHorizontal: 9,
        borderRadius: 11,
        overflow: 'hidden',
    },
    statsIconBtn: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Daily goal ring
    goalRingWrap: { alignItems: 'center', width: 60 },
    goalRing: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 5,
        borderColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    goalRingMet: { borderColor: Colors.secondary },
    goalRingText: { color: Colors.onSurface, fontWeight: 'bold', fontSize: 13 },
    goalRingTrack: {
        width: 56,
        height: 5,
        borderRadius: 3,
        backgroundColor: Colors.surface,
        marginTop: 5,
        overflow: 'hidden',
    },
    goalRingFill: { height: 5, backgroundColor: Colors.secondary },

    // Stats screen
    statsContainer: { flex: 1, backgroundColor: Colors.background, padding: 15 },
    statsHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    statsBackBtn: { padding: 4 },
    statsTitle: { color: Colors.onBackground, fontSize: 22, fontWeight: 'bold' },
    statRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
    statCard: {
        flex: 1,
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 14,
    },
    statEmoji: { fontSize: 22 },
    statBig: { color: Colors.onSurface, fontSize: 24, fontWeight: 'bold' },
    statSub: { color: Colors.onSurfaceVariant, fontSize: 11, marginTop: 2 },
    levelTopRow: { flexDirection: 'row', justifyContent: 'flex-start' },
    xpText: { color: Colors.onSurface, fontSize: 13, marginTop: 8 },
    xpSub: { color: Colors.onSurfaceVariant },
    xpBarTrack: {
        width: '100%',
        height: 7,
        backgroundColor: Colors.background,
        borderRadius: 4,
        marginTop: 5,
        overflow: 'hidden',
    },
    xpBarFill: { height: 7, backgroundColor: Colors.primary },
    sectionCard: {
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 14,
        marginBottom: 14,
    },
    sectionTitle: {
        color: Colors.onSurface,
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    chartRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 84,
    },
    chartBarWrap: { alignItems: 'center', flex: 1 },
    chartBar: { width: 18, borderRadius: 3, backgroundColor: Colors.primary },
    chartBarToday: { backgroundColor: Colors.secondary },
    chartBarEmpty: { backgroundColor: Colors.primaryVariant },
    chartLabel: { color: Colors.onSurfaceVariant, fontSize: 9, marginTop: 4 },
    chartCount: { color: Colors.onSurfaceVariant, fontSize: 9, marginBottom: 2 },
    badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
    badgeIcon: { fontSize: 28 },
    badgeLocked: { opacity: 0.3 },
    goalStepperRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    goalStepperLabel: { color: Colors.onSurface, fontSize: 14 },
    stepperControls: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    stepBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepBtnText: { color: Colors.secondary, fontSize: 20, fontWeight: 'bold' },
    goalValue: {
        color: Colors.onSurface,
        fontSize: 18,
        fontWeight: 'bold',
        minWidth: 24,
        textAlign: 'center',
    },

    // Badge-unlock toast
    unlockToast: {
        position: 'absolute',
        top: 12,
        left: 20,
        right: 20,
        backgroundColor: Colors.primary,
        borderRadius: 12,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },
    unlockToastIcon: { fontSize: 26 },
    unlockToastText: { color: '#000', fontWeight: 'bold', fontSize: 14, flex: 1 },
});

export default styles;