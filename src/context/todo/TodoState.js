import React, {useReducer, useContext} from 'react';
import { Alert } from 'react-native';

import {
    ADD_TODO,
    CLEAR_ERROR,
    FETCH_TODOS,
    HIDE_LOADER,
    REMOVE_TODO,
    SHOW_ERROR,
    SHOW_LOADER,
    UPDATE_TODO
}
from '../types';
import { TodoContext } from './todoContext';
import { todoRecuder } from './todoReducer';
import { ScreenContext } from '../screen/screenContext';
import { Http } from '../../http';

export const TodoState = ({ children }) => {
    const initialState = {
        todos: [],
        loading: false,
        error: null
    }

    const { changeScreen } = useContext(ScreenContext);
    const [state, dispatch] = useReducer(todoRecuder, initialState);

    const addTodo = async (title) => {
        clearError();
        try {
            const data = await Http.post(
                'url/todos.json',
                { title }
            );
            dispatch({ type: ADD_TODO, title, id: data.name });
        } catch (e) {
            showError('Упс, что-то пошло не так...');
        }
        
    }

    const removeTodo = (id) => {
        const titleTodo = state.todos.find((todo) => todo.id === id).title;
        Alert.alert(
            'Удаление элемента',
            `Вы уверены что хотите удалить "${titleTodo}"?`,
            [
                {
                    text: 'Отмена',
                    style: 'cancel',
                },
                {
                    text: 'Удалить',
                    style: 'destructive',
                    onPress: async () => {
                        changeScreen(null);
                        clearError();
                        try {
                            await Http.delete(
                                `url/todos/${id}.json`
                            );
                            dispatch({ type: REMOVE_TODO, id });
                        } catch (e) {
                            showError('Упс, что-то пошло не так...');
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    }

    const fetchTodos = async () => {
        showLoader();
        clearError();
        try {
            const data = await Http.get(
                'url/todos.json'
            );
            const todos = Object.keys(data).map(key => ({ ...data[key], id: key }));
            dispatch({ type: FETCH_TODOS, todos });
        } catch (e) {
            showError('Упс, что-то пошло не так...');
        } finally {
            hideLoader();
        }
    }

    const updateTodo = async (id, title) => {
        clearError();
        try {
            await Http.patch(
                `url/todos/${id}.json`,
                { title }
            );
            dispatch({ type: UPDATE_TODO, id, title });
        } catch (e) {
            showError('Упс, что-то пошло не так...');
        }
       
    }

    const showLoader = () => dispatch({ type: SHOW_LOADER });

    const hideLoader = () => dispatch({ type: HIDE_LOADER });

    const showError = (error) => dispatch({ type: SHOW_ERROR, error });

    const clearError = () => dispatch({ type: CLEAR_ERROR }); 

    return (
        <TodoContext.Provider
            value={{
                todos: state.todos,
                loading: state.loading,
                error: state.error,
                addTodo,
                removeTodo,
                updateTodo,
                fetchTodos
            }}
        >
            {children}
        </TodoContext.Provider>
    )
}