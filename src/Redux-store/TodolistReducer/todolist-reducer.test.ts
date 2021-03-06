import {v1} from 'uuid';
import {
    addTodolistAC,
    changeFilterTodolistAC,
    changeTitleTodolistAC,
    removeTodolistAC, setTodolistsAC, setTodolistStatus,
    TodolistDomainType,
    todolistReducer
} from './todolist-reducer';
import {start} from 'repl';

let todolistId1: string;
let todolistId2: string;
let startState: Array<TodolistDomainType> = [];

beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();

    startState = [
        {
            id: todolistId1,
            title: 'What to learn',
            filter: 'All',
            order: 0,
            addedDate: '',
            todolistEntityStatus: 'succeeded',
        },
        {
            id: todolistId2,
            title: 'What to buy',
            filter: 'All',
            order: 0,
            addedDate: '',
            todolistEntityStatus: 'succeeded',
        }
    ];
});

test('todolist will be added', () => {
    let newTodolistTitle = 'New todolist';

    const newTodolist = {id: todolistId1, title: newTodolistTitle, order: 0, addedDate: '',};
    const endState = todolistReducer(startState, addTodolistAC({todolist: newTodolist}));

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(newTodolistTitle);
});

test('todolist should be removed', () => {
    const endState = todolistReducer(startState, removeTodolistAC({todolistId: todolistId1}));

    expect(endState.length).toBe(1);
    expect(endState[0].title).toBe('What to buy');
});

test('change title of todolist', () => {
    const endState = todolistReducer(startState, changeTitleTodolistAC({
        title: 'What to listen',
        todolistId: todolistId1
    }));

    expect(endState.length).toBe(2);
    expect(endState[0].title).toBe('What to listen');
    expect(endState[1].title).toBe('What to buy');
});

test('change filter of todolist', () => {
    const endState = todolistReducer(startState, changeFilterTodolistAC({
        filter: 'Completed',
        todolistId: todolistId1
    }));

    expect(endState.length).toBe(2);
    expect(endState[0].filter).toBe('Completed');
    expect(endState[1].filter).toBe('All');
});

test('todolists should be setted', () => {
    const endState = todolistReducer([], setTodolistsAC({todolists: startState}));

    expect(endState.length).toBe(2);

});

test('todolist status should be changed', () => {
    const endState = todolistReducer(startState, setTodolistStatus({
        todolistEntityStatus: 'loading',
        todolistId: startState[1].id
    }));

    expect(endState[0].todolistEntityStatus).toBe('succeeded');
    expect(endState[1].todolistEntityStatus).toBe('loading');

});

