import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';

import { graphqlBaseQuery } from '../../graphqlBaseQuery';

export const todosApi = createApi({
  reducerPath: 'todosApi',
  // refetchOnFocus: true,
  // refetchOnReconnect: true,
  baseQuery: graphqlBaseQuery({
    baseUrl: 'https://graphqlzero.almansi.me/api',
  }),
  // tagTypes: ['Todos'],
  endpoints: (builder) => ({
    getTodos: builder.query<any, void>({
      query: () => ({
        query: gql`
          query GetTodos($options: PageQueryOptions) {
            todos(options: $options) {
              data {
                id
                title
                completed
              }
            }
          }
        `,
        variables: {
          options: {
            paginate: {
              page: 1,
              limit: 5,
            },
          },
        },
      }),
      // providesTags: ['Todos'],
      transformResponse: (response: any) => response.todos.data,
    }),

    createTodo: builder.mutation({
      query: (title) => ({
        query: gql`
          mutation CreateTodo($input: CreateTodoInput!) {
            createTodo(input: $input) {
              id
              title
              completed
            }
          }
        `,
        variables: {
          input: { title, completed: false },
        },
      }),
      onQueryStarted(title, { dispatch, queryFulfilled }) {
        const update = dispatch(
          todosApi.util.updateQueryData('getTodos', undefined, (todos) => {
            return [
              ...todos,
              {
                id: Number.parseInt(todos[todos.length - 1].id, 10) + 1,
                title,
                completed: false,
              },
            ];
          }),
        );

        queryFulfilled.catch(() => {
          update.undo();
        });
      },
      // invalidatesTags: ['Todos'],
    }),

    updateTodo: builder.mutation({
      query: (todo) => {
        const { id, ...input } = todo;

        return {
          query: gql`
            mutation UpdateTodo($id: ID!, $input: UpdateTodoInput!) {
              updateTodo(id: $id, input: $input) {
                id
                title
                completed
              }
            }
          `,
          variables: { id, input },
        };
      },
      onQueryStarted(updatedTodo, { dispatch, queryFulfilled }) {
        const update = dispatch(
          todosApi.util.updateQueryData('getTodos', undefined, (todos) => {
            return todos.map((todo: any) => {
              if (todo.id === updatedTodo.id) return updatedTodo;

              return todo;
            });
          }),
        );

        queryFulfilled.catch(() => {
          update.undo();
        });
      },
      // invalidatesTags: ['Todos'],
    }),

    deleteTodo: builder.mutation({
      query: (id) => ({
        query: gql`
          mutation DeleteTodo($id: ID!) {
            deleteTodo(id: $id)
          }
        `,
        variables: { id },
      }),
      onQueryStarted(id, { dispatch, queryFulfilled }) {
        const update = dispatch(
          todosApi.util.updateQueryData('getTodos', undefined, (todos) => {
            return todos.filter((todo: any) => todo.id !== id);
          }),
        );

        queryFulfilled.catch(() => {
          update.undo();
        });
      },
      // invalidatesTags: ['Todos'],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todosApi;
