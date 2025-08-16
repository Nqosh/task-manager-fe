import React, { createContext, useState, useEffect, useMemo, useContext } from 
"react";
import api from '../api/axiosInstance'
import { DataUtils } from "../utils/DataUtils";
import * as signalR from '@microsoft/signalr'

export type Task = {
    id: string
    title: string,
    description?: string
    status: 'TODO' | 'IN_PROGRESS' | 'DONE'
    priority: 'LOW' | 'MEDIUM' | 'HIGH'
    assigneeId?: string
    creatorId: string
    createdAt: string,
    updatedAt?: string
}

type CtxType = {
    tasks: Task[]
    refresh: () => Promise<void>
    createTask:(partial: Partial<Task>) => 
        Promise<void>
    updateTask:(id: string, patch:Partial<Task>) =>
        Promise<void>
    removeTask: (id:string) => 
        Promise<void>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Ctx = createContext<CtxType>(null as any)

export function TasksProvider({ children }: {
    children: React.ReactNode }) {
 const [tasks, setTasks] = useState<Task[]>([])

async function refresh() {
   const { data} =  await api.get('/tasks/tasksList')
   for(const task of data) {
    const textEnum = DataUtils.MapTaskStatusEnumToText(task.status);
    task.status = textEnum;
   }
   setTasks(data);
}

async function createTask(partial: Partial<Task>) {
    const optimistic = { 
        ...partial, 
        id: `tmp-${Math.random()}`, 
        status: partial.status ?? 0,
        description: "New Task"
    } as Task
    setTasks(prev => [optimistic, ...prev])
     await api.post('/tasks/createtask', {
        title: partial.title,
        description: partial.description ?? "New Task",
        priority: partial.priority ?? 0,
        assigneeId: partial.assigneeId ?? DataUtils.createGuid()
    })
    refresh();
}

async function updateTask(id: string, patch: Partial<Task>) {
    const old = tasks.find(t => t.id === id);
    if(!old) return;
    const optimistic = { ...old, ...patch }
    const updatedTask = DataUtils.MapTaskStatusEnum(optimistic.status);
    setTasks(prev => prev.map(t => t.id == id ? optimistic as Task : t));
    await api.put(`/tasks/updatetask?id=${id}`, {status:updatedTask });
    refresh();
}

async function removeTask(id: string) {
    const prev = tasks;
    setTasks(tasks.filter(t => t.id !== id));
    try {
        await api.delete(`/Tasks/deleteTask?id=${id}`)
        refresh();
    } catch(error) {
        console.error('Error deleting task:', error);
        setTasks(prev)
    }
}

useEffect(() => { 
    refresh() 
    const token = localStorage.getItem('token') || '' 
    const base = (import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api').replace('/api','') 
    const conn = new signalR.HubConnectionBuilder() 
    .withUrl(`${base}/hubs/tasks`, { 
        accessTokenFactory: () => token 
    }) .withAutomaticReconnect() .build() 
    conn.on('TaskUpdated', (task: Task) => { 
            setTasks(prev => { const exists = prev.some(t => t.id === task.id) 
                return exists ? prev.map(t => t.id === task.id ? task : t) : [task, ...prev] }) 
            }) 
    conn.on('TaskDeleted', (id: string) => setTasks(prev => prev.filter(t => t.id !== id))) 
    conn.start().catch(() => {}) 
    return () => { conn.stop() } }, [])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const value = useMemo(() => ({ tasks, refresh, createTask, updateTask, removeTask}), [tasks])
      return <Ctx.Provider value={value}>{children}</Ctx.Provider>
  
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTasks = () => useContext(Ctx);