/**
 * Utility functions for handling drag and drop operations in the task list
 */

/**
 * Helper function to insert task at correct position
 */
const insertTaskAtPosition = (array, task, insertBeforeId) => {
    if (insertBeforeId) {
        const targetIndex = array.findIndex(t => t.id === insertBeforeId);
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
export const handleReorderTask = (tasks, taskId, state, insertBeforeId) => {
    const updatedTasks = { ...tasks };
    const arrayKey = getArrayKeyFromState(state);
    const array = updatedTasks[arrayKey];

    const sourceIndex = array.findIndex(t => t.id === taskId);
    if (sourceIndex === -1) return updatedTasks;

    // Remove task from current position
    const [taskToMove] = array.splice(sourceIndex, 1);

    // Insert at new position
    insertTaskAtPosition(array, taskToMove, insertBeforeId);

    return updatedTasks;
};

/**
 * Handles moving a task between different columns
 */
export const handleMoveTask = (tasks, taskId, originalState, targetState, insertBeforeId) => {
    const updatedTasks = { ...tasks };
    const sourceArray = updatedTasks[getArrayKeyFromState(originalState)];
    const targetArray = updatedTasks[getArrayKeyFromState(targetState)];

    const sourceIndex = sourceArray.findIndex(t => t.id === taskId);
    if (sourceIndex === -1) return updatedTasks;

    // Remove task from source column
    const [taskToMove] = sourceArray.splice(sourceIndex, 1);

    // Update task state and insert into target column
    taskToMove.state = targetState;
    insertTaskAtPosition(targetArray, taskToMove, insertBeforeId);

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