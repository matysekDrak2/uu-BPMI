/**
 * Utility functions for handling drag and drop operations in the task list
 */

/**
 * Handles task reordering within the same column
 */
export const handleReorderTask = (tasks, taskId, state, insertBeforeId, insertPosition) => {
    const updatedTasks = { ...tasks };
    const arrayKey = getArrayKeyFromState(state);

    const sourceIndex = updatedTasks[arrayKey].findIndex(t => t.id === taskId);
    if (sourceIndex === -1) return updatedTasks;

    const taskToMove = updatedTasks[arrayKey][sourceIndex];
    updatedTasks[arrayKey].splice(sourceIndex, 1);

    if (insertBeforeId) {
        const targetIndex = updatedTasks[arrayKey].findIndex(t => t.id === insertBeforeId);
        if (targetIndex !== -1) {
            const insertIndex = insertPosition === 'after' ? targetIndex + 1 : targetIndex;
            updatedTasks[arrayKey].splice(insertIndex, 0, taskToMove);
        } else {
            updatedTasks[arrayKey].push(taskToMove);
        }
    } else {
        updatedTasks[arrayKey].push(taskToMove);
    }

    return updatedTasks;
};

/**
 * Handles moving a task between different columns
 */
export const handleMoveTask = (tasks, taskId, originalState, targetState, insertBeforeId, insertPosition) => {
    const updatedTasks = { ...tasks };

    const sourceArray = getArrayKeyFromState(originalState);
    const targetArray = getArrayKeyFromState(targetState);

    const taskIndex = updatedTasks[sourceArray].findIndex(t => t.id === taskId);
    if (taskIndex === -1) return updatedTasks;

    const taskToMove = { ...updatedTasks[sourceArray][taskIndex], state: targetState };
    updatedTasks[sourceArray] = updatedTasks[sourceArray].filter(t => t.id !== taskId);

    if (insertBeforeId) {
        const targetIndex = updatedTasks[targetArray].findIndex(t => t.id === insertBeforeId);
        if (targetIndex !== -1) {
            const insertIndex = insertPosition === 'after' ? targetIndex + 1 : targetIndex;
            updatedTasks[targetArray].splice(insertIndex, 0, taskToMove);
        } else {
            updatedTasks[targetArray].push(taskToMove);
        }
    } else {
        updatedTasks[targetArray].push(taskToMove);
    }

    return updatedTasks;
};

/**
 * Updates task with new ID after backend update
 */
export const updateTaskWithNewId = (tasks, targetState, oldTaskId, updatedTaskResponse) => {
    const targetArray = getArrayKeyFromState(targetState);
    const newTaskId = updatedTaskResponse.id;

    const tasksWithNewId = { ...tasks };
    const taskToUpdateIndex = tasksWithNewId[targetArray].findIndex(t => t.id === oldTaskId);

    if (taskToUpdateIndex !== -1) {
        tasksWithNewId[targetArray][taskToUpdateIndex] = {
            ...tasksWithNewId[targetArray][taskToUpdateIndex],
            id: newTaskId,
            ...updatedTaskResponse
        };
    }

    return tasksWithNewId;
};

/**
 * Converts state number to corresponding array key
 */
export const getArrayKeyFromState = (state) => {
    if (state === 0) return 'open';
    if (state === 1) return 'inProgress';
    if (state === 2) return 'completed';
    return 'open';
}; 