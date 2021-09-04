import {FilterType, TasksType, TaskType, TodolistType} from '../App';
import {v1} from 'uuid';
import {addTodolistType, removeTodolistType} from './todolist-reducer';

export type allTasksTypes = addTaskType
    | removeTaskType
    | changeTaskTitleType
    | changeTaskStatusType
    | addTodolistType
    | removeTodolistType


export type addTaskType = {
    type: 'ADD-TASK'
    title: string
    todolistId: string
}

export type removeTaskType = {
    type: 'REMOVE-TASK'
    taskId: string
    todolistId: string
}

export type changeTaskTitleType = {
    type: 'CHANGE-TASK-TITLE'
    taskId: string
    todolistId: string
    title: string
}

export type changeTaskStatusType = {
    type: 'CHANGE-TASK-STATUS'
    taskId: string
    todolistId: string
    isDone: boolean
}

const initialState: TasksType = {}

export const taskReducer = (state: TasksType = initialState, action: allTasksTypes): TasksType => {
    switch (action.type) {
        case 'ADD-TASK':
            const newTask: TaskType = {
                id: v1(),
                isDone: false,
                title: action.title,
            }
            return {
                ...state,
                [action.todolistId]: [...state[action.todolistId], newTask]
            }

        case 'REMOVE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].filter(taskId => taskId.id !== action.taskId)
            }

        case 'CHANGE-TASK-TITLE':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id !== action.taskId ? t : {
                    ...t,
                    title: action.title
                })
            }

        case 'CHANGE-TASK-STATUS':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id !== action.taskId ? t : {
                    ...t,
                    isDone: action.isDone
                })
            }

        case 'ADD-TODOLIST':
            return {
                ...state,
                [action.todolistId]: []
            }

        case 'REMOVE-TODOLIST':
            let stateCopy = {...state}
            delete stateCopy[action.todolistId]
            return stateCopy

        default:
            return state
    }
}

export const addTaskAC = (title: string, todolistId: string): addTaskType => {
    return {
        type: 'ADD-TASK',
        title,
        todolistId,
    }
}


export const removeTaskAC = (taskId: string, todolistId: string): removeTaskType => {
    return {
        type: 'REMOVE-TASK',
        taskId,
        todolistId,
    }
}

export const changeTaskTitleAC = (title: string, todolistId: string, taskId: string): changeTaskTitleType => {
    return {
        type: 'CHANGE-TASK-TITLE',
        taskId,
        todolistId,
        title
    }
}

export const changeTaskStatusAC = (taskId: string, isDone: boolean, todolistId: string, ): changeTaskStatusType => {
    return {
        type: 'CHANGE-TASK-STATUS',
        taskId,
        todolistId,
        isDone
    }
}



