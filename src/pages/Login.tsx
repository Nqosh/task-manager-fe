import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
    const { register: reg, handleSubmit }  = useForm<{userNameOrEmail:string; password:string}>()
    const { login } = useAuth()
    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit(async (d) => { 
            await login(d.userNameOrEmail, d.password);             
            location.href = '/dashboard'
            })}
            className='bg-white p-6 rounded-2xl shadow w-full max-w-sm space-y-3'>

                <h1 className='text-2xl font-semibold'>Login</h1>
                <input placeholder='Username or Email' {...reg('userNameOrEmail', { required : true })} className='border p-2 rounded w-full'/>
                <input placeholder= "Password" type="password" {...reg('password',{ required: true })} className='border p-2 rounded w-full'/>
                <button className='w-full py-2 rounded-2xl bg-black text-white'>Sign In</button>
                <a className='text-sm text-blue-600' href="/register">Register an Account?</a>
            </form>
        </div>
    )
}