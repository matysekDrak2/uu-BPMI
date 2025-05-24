/**
 * Utility functions for handling drag and drop operations in the task list
 */

/**
 * Helper function to insert task at correct position
 */
const insertTaskAtPosition = (array, task, targetTaskId = null) => {
    if (targetTaskId) {
        const targetIndex = array.findIndex(t => t.id === targetTaskId);
        if (targetIndex !== -1) {
            array.splice(targetIndex, 0, task);
            return;
        }
    }
    array.push(task);
};

/**
 * Handles task reordering within the same column
 */
export const handleReorderTask = (tasks, taskId, state, targetTaskId = null) => {
    const updatedTasks = { ...tasks };
    const arrayKey = getArrayKeyFromState(state);
    const array = updatedTasks[arrayKey];

    const sourceIndex = array.findIndex(t => t.id === taskId);
    if (sourceIndex === -1) return updatedTasks;

    const [taskToMove] = array.splice(sourceIndex, 1);

    insertTaskAtPosition(array, taskToMove, targetTaskId);

    return updatedTasks;
};

/**
 * Handles moving a task between different columns
 */
export const handleMoveTask = (tasks, taskId, originalState, targetState, targetTaskId = null) => {
    const updatedTasks = { ...tasks };
    const sourceArray = updatedTasks[getArrayKeyFromState(originalState)];
    const targetArray = updatedTasks[getArrayKeyFromState(targetState)];

    const sourceIndex = sourceArray.findIndex(t => t.id === taskId);
    if (sourceIndex === -1) return updatedTasks;

    const [taskToMove] = sourceArray.splice(sourceIndex, 1);

    taskToMove.state = targetState;
    insertTaskAtPosition(targetArray, taskToMove, targetTaskId);

    return updatedTasks;
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