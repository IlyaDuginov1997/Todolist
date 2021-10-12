import {AddTodolistType, RemoveTodolistType, SetTodolistsType} from '../TodolistReducer/todolist-reducer';
import {TasksType} from '../../Components/TodolistsList';
import {TaskStatuses, TaskType, todolistsAPI} from '../../API/todolists-api';
import {Dispatch} from 'redux';
import {AppRootStateType} from '../Store';
import {setStatusPreloader} from '../AppReducer/app-reducer';

export type AllTasksTypes = AddTaskType
    | RemoveTaskType
    | ChangeTaskTitleType
    | ChangeTaskStatusType
    | AddTodolistType
    | RemoveTodolistType
    | SetTodolistsType
    | SetTasksType


export type AddTaskType = ReturnType<typeof addTaskAC>
export type RemoveTaskType = ReturnType<typeof removeTaskAC>
export type ChangeTaskTitleType = ReturnType<typeof changeTaskTitleAC>
export type ChangeTaskStatusType = ReturnType<typeof changeTaskStatusAC>
export type SetTasksType = ReturnType<typeof setTasksAC>

const initialState: TasksType = {};

export const taskReducer = (state: TasksType = initialState, action: AllTasksTypes): TasksType => {
    switch (action.type) {
        case 'ADD-TASK':
            const newTask: TaskType = {...action.task};
            return {
                ...state,
                [action.task.todoListId]: [newTask, ...state[action.task.todoListId],]
            };

        case 'REMOVE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].filter(taskId => taskId.id !== action.taskId)
            };

        case 'CHANGE-TASK-TITLE':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id !== action.taskId ? t : {
                    ...t,
                    title: action.title
                })
            };

        case 'CHANGE-TASK-STATUS':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id !== action.taskId ? t : {
                    ...t,
                    status: action.status
                })
            };
        case 'SET-TASKS':
            return {
                ...state,
                [action.todolistId]: action.tasks
            };


        case 'ADD-TODOLIST':
            return {
                ...state,
                [action.todolist.id]: []
            };

        case 'REMOVE-TODOLIST':
            let stateCopy = {...state};
            delete stateCopy[action.todolistId];
            return stateCopy;

        case 'SET-TODOLISTS':
            const copyState = {...state};

            action.todolists.forEach(t => {
                copyState[t.id] = [];
            });

            return copyState;
        default:
            return state;
    }
};

export const addTaskAC = (task: TaskType) => {
    return {
        type: 'ADD-TASK',
        task
    } as const;
};


export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {
        type: 'REMOVE-TASK',
        taskId,
        todolistId,
    } as const;
};

export const changeTaskTitleAC = (title: string, todolistId: string, taskId: string) => {
    return {
        type: 'CHANGE-TASK-TITLE',
        taskId,
        todolistId,
        title
    } as const;
};

export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string,) => {
    return {
        type: 'CHANGE-TASK-STATUS',
        taskId,
        todolistId,
        status,
    } as const;
};

export const setTasksAC = (tasks: TaskType[], todolistId: string) => {
    return {
        type: 'SET-TASKS',
        tasks,
        todolistId,
    } as const;
};


export const setTaskTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setStatusPreloader('loading'));
        todolistsAPI.getTodolistTasks(todolistId)
            .then(res => {
                dispatch(setTasksAC(res.items, todolistId));
                dispatch(setStatusPreloader('succeeded'));
            });
    };
};


export const removeTaskTC = (taskId: string, todolistId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setStatusPreloader('loading'));
        todolistsAPI.deleteTodolistTask(todolistId, taskId)
            .then(res => {
                dispatch(removeTaskAC(taskId, todolistId));
                dispatch(setStatusPreloader('succeeded'));
            });
    };
};


export const addTaskTC = (title: string, todolistId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setStatusPreloader('loading'));
        todolistsAPI.createTodolistTask(todolistId, title)
            .then(res => {
                dispatch(addTaskAC(res.data.item));
                dispatch(setStatusPreloader('succeeded'));
            });
    };
};


export const changeTaskStatusTC = (taskId: string, status: TaskStatuses, todolistId: string) => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {
        const allTasks = getState().tasks;
        const task = allTasks[todolistId].find((t) => t.id === taskId);
        if (task) {
            dispatch(setStatusPreloader('loading'));
            todolistsAPI.updateTodolistTask(todolistId, taskId, {
                title: task.title,
                description: task.description,
                status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
            })
                .then(res => {
                    dispatch(changeTaskStatusAC(taskId, status, todolistId));
                    dispatch(setStatusPreloader('succeeded'));
                });
        }
    };
};

export const changeTaskTitleTC = (title: string, taskId: string, todolistId: string) => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {
        const allTasks = getState().tasks;
        const task = allTasks[todolistId];
        const ourTask = task.find((t) => {
            if (t.id === taskId) {
                return t;
            }
        });
        if (ourTask) {
            dispatch(setStatusPreloader('loading'));
            todolistsAPI.updateTodolistTask(todolistId, taskId, {
                title,
                description: ourTask.description,
                status: ourTask.status,
                priority: ourTask.priority,
                startDate: ourTask.startDate,
                deadline: ourTask.deadline,
            })
                .then(res => {
                    dispatch(changeTaskTitleAC(title, todolistId, taskId));
                    dispatch(setStatusPreloader('succeeded'));
                });
        }
    };
};