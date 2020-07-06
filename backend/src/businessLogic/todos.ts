import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from "../requests/updateTodoRequest"
import * as uuid from 'uuid'
import { ToDoAccess } from '../dataLayer/todoAccess'
import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate'

const todoAccess = new ToDoAccess()

export async function getAllToDoItems(userId: string): Promise<TodoItem[]> {
  return todoAccess.getAllToDoItems(userId)
}

export async function createToDoItem(
    createTodoRequest: CreateTodoRequest,
    jwtToken: string
  ): Promise<TodoItem> {
  
    const itemId = uuid.v4()
  
    return await todoAccess.createToDoItem({
      todoId: itemId,
      userId: jwtToken,
      name: createTodoRequest.name,
      dueDate: createTodoRequest.dueDate,
      createdAt: new Date().toISOString(),
      done: false
    })
}

export async function updateToDoItem(
    updateTodoRequest: UpdateTodoRequest,
    todoId: string
  ){
    
    return await todoAccess.UpdateToDoItem(updateTodoRequest, todoId)
}

export async function deleteToDoItem(
    todoId: string
  ){
    
    return await todoAccess.DeleteToDoItem(todoId)
}

export async function generateUploadUrl(
    todoId: string,
    attachmentUrl: string
  ){
    
    return await todoAccess.GenerateUploadUrl(todoId, attachmentUrl)
}