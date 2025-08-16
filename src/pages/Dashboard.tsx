import { useTasks } from "../contexts/TasksContext";
import { useState } from "react";

export default function Dashboard() {
    const { tasks, createTask, updateTask, removeTask } = useTasks();
    const [title, setTitle] = useState('');
    const byStatus = (s: string) => tasks.filter(t => t.status.toString() == s)
    console.log(tasks);
    console.log(tasks);

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-3xl font-bold">Tasks</h1>
            <div className="flex gap-3">
                <input className="border p-2 rounded flex-1" placeholder="New task title...." value={title}
                onChange={e => setTitle(e.target.value)}/>
                <button className="px-4 py-2 rounded bg-black text-white" onClick={()=>
                    title && createTask({title})}> Add
                </button>
               <a className="logout-btn" href="/login" onClick={() => localStorage.removeItem('token')}>Logout</a> 
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['TODO','IN_PROGRESS','DONE'] as const)
                    .map(s => (
                <div key={s} className="bg-white rounded-2xl shadow p-3">
                    <h2 className="font-semibold mb-2">{ s.replace('_','')}</h2>
                    <div className="space-y-2">{byStatus(s).map(t => (
                        <div key={t.id} className="border rounded p-3">
                        <div className="flex items-center justify-between">
                            <input className="font-medium w-full"  defaultValue={t.title} onBlur={(e) => updateTask(t.id, { title: e.target.value})}/>
                            <button className="text-xs" onClick={() => removeTask(t.id)}>x</button>
                        </div>
                     <select className="mt-2 border rounded p-1" defaultValue={t.status} 
                     // eslint-disable-next-line @typescript-eslint/no-explicit-any
                     onChange={(e)=> updateTask(t.id, { status: e.target.value as any })}>
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="DONE">DONE</option>
                     </select>
                     </div>
                    ))}
                </div>
                </div>
            ))}
            </div>
        </div>
    )
}