import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
    const { register: reg, handleSubmit }  = useForm<{username:string; email:string; password:string}>()
    const { register: doRegister } = useAuth()
    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit(async (d) => { 
            await doRegister(d.username,d.email, d.password);             
            location.href = '/login'
            })}
            className='bg-white p-6 rounded-2xl shadow w-full max-w-sm space-y-3'>

                <h1 className='text-2xl font-semibold'>Register</h1>
                <input placeholder='Username' {...reg('username', { required : true })} className='border p-2 rounded w-full'/>
                <input placeholder='Email' {...reg('email', { required : true })} className='border p-2 rounded w-full'/>
                <input placeholder= "Password" type="password" {...reg('password',{ required: true, minLength: 6 })} className='border p-2 rounded w-full'/>
                <button className='w-full py-2 rounded-2xl bg-black text-white'>Create Account</button>
                <a className='text-sm text-blue-600' href="/login">Back to login</a>
            </form>
        </div>
    )
}