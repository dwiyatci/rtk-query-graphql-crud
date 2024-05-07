'use client';

import { useEffect, useRef, useState } from 'react';
import { useImmer } from 'use-immer';

import {
  useCreateTodoMutation,
  useDeleteTodoMutation,
  useGetTodosQuery,
  useUpdateTodoMutation,
} from '@/app/lib/features/todos/todosApiSlice';

import styles from './Todos.module.css';

export function Todos() {
  const { isError, isLoading, data: todos } = useGetTodosQuery();
  const [createTodo, { isError: isCreateError }] = useCreateTodoMutation();
  const [updateTodo, { isError: isUpdateError }] = useUpdateTodoMutation();
  const [deleteTodo, { isError: isDeleteError }] = useDeleteTodoMutation();

  // const [todos, updateTodos] = useImmer<any>([]);
  const [items, updateItems] = useImmer<any>([]);

  const [itemIdInEdit, setItemIdInEdit] = useState();

  const deleteDialogRef = useRef<any>();
  const [itemIdToDelete, setItemIdToDelete] = useState();

  const createDialogRef = useRef<any>();
  const [newItemText, setNewItemText] = useState('');

  // useEffect(() => {
  //   fetchTodos().then(updateTodos);
  // }, []);

  useEffect(() => {
    updateItems(todos);
  }, [todos]);

  if (isError || isCreateError || isUpdateError || isDeleteError) {
    return <div>An error has occurred!</div>;
  }

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <h3 className={styles.header}>todos</h3>
      <div className={styles.todos}>
        <div className={styles.todo}>
          <span>id</span>
          <span>title</span>

          <button onClick={() => createDialogRef.current?.showModal()}>create</button>
        </div>
        <hr />

        {items?.map(({ id, title, completed }: any) => {
          return (
            <div key={id} className={styles.todo}>
              <span>{id}</span>
              <span>
                <input
                  type="checkbox"
                  disabled={isEditing()}
                  checked={completed}
                  onChange={(e) =>
                    updateTodoById({ id, key: 'completed', value: e.target.checked })
                  }
                />

                {isItemInEdit(id) ? (
                  <input
                    size={80}
                    value={title}
                    onChange={(e) => updateItemById({ id, key: 'title', value: e.target.value })}
                    onKeyUp={(e) => {
                      if (e.key === 'Enter') {
                        handleSave({ id, title });
                        return;
                      }

                      if (e.key === 'Escape') {
                        handleCancel(id);
                      }
                    }}
                  />
                ) : completed ? (
                  <s>{title}</s>
                ) : (
                  <span>{title}</span>
                )}
              </span>

              <div>
                {isItemInEdit(id) ? (
                  <>
                    <button onClick={() => handleSave({ id, title })}>save</button>

                    <button onClick={() => handleCancel(id)}>cancel</button>
                  </>
                ) : (
                  <>
                    <button disabled={isEditing()} onClick={() => setItemIdInEdit(id)}>
                      edit
                    </button>

                    <button
                      disabled={isEditing()}
                      onClick={() => {
                        deleteDialogRef.current?.showModal();
                        setItemIdToDelete(id);
                      }}
                    >
                      delete
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}

        <dialog
          ref={createDialogRef}
          onClose={(e: any) => {
            const retVal = e.target.returnValue;

            if (retVal) createTodo(retVal);
          }}
        >
          <form>
            <p>
              <label htmlFor="newItem">new item: </label>
              <input
                id="newItem"
                size={80}
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
              />
            </p>

            <div>
              <button
                id="confirmBtn"
                value={newItemText}
                onClick={(e) => {
                  e.preventDefault();
                  createDialogRef.current?.close(newItemText);
                  setNewItemText('');
                }}
              >
                create
              </button>

              <button value="" formMethod="dialog" onClick={() => setNewItemText('')}>
                cancel
              </button>
            </div>
          </form>
        </dialog>

        <dialog ref={deleteDialogRef}>
          <p>confirm delete?</p>

          <button
            autoFocus
            onClick={() => {
              // deleteTodoById(itemIdToDelete);
              deleteTodo(itemIdToDelete);
              deleteDialogRef.current?.close();
              setItemIdToDelete(undefined);
            }}
          >
            confirm
          </button>

          <button
            onClick={() => {
              deleteDialogRef.current?.close();
              setItemIdToDelete(undefined);
            }}
          >
            cancel
          </button>
        </dialog>
      </div>
    </>
  );

  function isItemInEdit(id: string) {
    return id === itemIdInEdit;
  }

  function isEditing() {
    return !!itemIdInEdit;
  }

  function handleSave({ id, title }: any) {
    setItemIdInEdit(undefined);
    updateTodoById({ id, key: 'title', value: title });
  }

  function handleCancel(id: string) {
    setItemIdInEdit(undefined);
    updateItemById({
      id,
      key: 'title',
      value: todos.find((todo: any) => todo.id === id)?.title,
    });
  }

  function updateItemById({ id, key, value }: any) {
    updateById({ updateFn: updateItems, id, key, value });
  }

  function updateTodoById({ id, key, value }: any) {
    // updateById({ updateFn: updateTodos, id, key, value });
    const target = items.find((item: any) => item.id === id);

    if (target) updateTodo({ ...target, [key]: value });
  }

  function updateById({ updateFn, id, key, value }: any) {
    updateFn((draft: any) => {
      const target = draft.find((x: any) => x.id === id);

      if (target) target[key] = value;
    });
  }

  // function createTodo(title: string) {
  //   updateTodos((draft: any) => {
  //     draft.push({
  //       id: Number.parseInt(draft[draft.length - 1].id, 10) + 1,
  //       title,
  //       completed: false,
  //     });
  //   });
  // }

  // function deleteTodoById(id: any) {
  //   updateTodos((draft: any) => {
  //     const targetIndex = draft.findIndex((x: any) => x.id === id);

  //     draft.splice(targetIndex, 1);
  //   });
  // }
}

// const TODOS = [
//   {
//     id: '1',
//     title: 'delectus aut autem',
//     completed: false,
//   },
//   {
//     id: '2',
//     title: 'quis ut nam facilis et officia qui',
//     completed: false,
//   },
//   {
//     id: '3',
//     title: 'fugiat veniam minus',
//     completed: false,
//   },
//   {
//     id: '4',
//     title: 'et porro tempora',
//     completed: true,
//   },
//   {
//     id: '5',
//     title: 'laboriosam mollitia et enim quasi adipisci quia provident illum',
//     completed: false,
//   },
// ];

// function fetchTodos() {
//   return Promise.resolve(TODOS);
// }
