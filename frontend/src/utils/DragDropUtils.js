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
