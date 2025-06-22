import { useAppContext } from '@/context/AppContext';
import React, { useState } from 'react';
import { toast } from 'sonner';
import PatientDashboard from './PatientDashboard';
import CaretakerDashboard from './CaretakerDashboard';

interface UserData {
    username: string;
    email: string;
    password: string;
    role: string;
}


const Login = () => {


    const {setShowUserLogin, setUser, axios, navigate} = useAppContext();

    const [state, setState] = useState("login")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [isShow, setIsShow] = useState(false)

    const [role, setRole] = useState('patient')


    const handleSubmit = async (event) => {
        try {
           
            event.preventDefault();
            
            const {data} = await axios.post(`/api/user/${state}`, {
                username, email, password, role, 
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (data.success){
                localStorage.setItem('token', data.token)
                localStorage.setItem("username", data.user.username)
                setUser(data.user)
                navigate('/')
                setShowUserLogin(false)
                toast.success("Login successfull")

            }
            else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }


    

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0  flex items-center text-sm text-gray-600 bg-gradient-to-r from-green-100  to-indigo-100 '>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 m-auto items-start p-8 py-12 w-[90%] max-w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white'>
        <p className='text-2xl font-medium m-auto'>
            <span className='text-primary'>User {state === 'login' ? 'Login' : "Sign Up"}</span>
        </p>
        {state === 'signup' && (
           
            <div className='w-full'>
                <p>Name</p>
                <input onChange={(e) => setUsername(e.target.value)} value={username} type="text" placeholder='Enter your name' className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary' required />
            </div>

        )}
        <div className='w-full'>
            <p>Email</p>
            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary' placeholder='Enter your email' />
        </div>
        <div className='w-full relative'>
            <p>Password</p>
            <input type={isShow ? 'text' : 'password'} onChange={(e) => setPassword(e.target.value)} value={password} className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary' placeholder='Enter your password'  />
            <span onClick={() => setIsShow(!isShow)} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer mt-3 text-sm'>
                {isShow ? 'Hide' : 'Show'}
            </span>
        </div>

        {state === 'signup' && (
            <div className='w-full'>
                <p>Select Role</p>
                <div className='flex mt-2 gap-4'>
                    <label className='flex items-center gap-2 cursor-pointer'>
                        <input
                         type="radio"
                         value='patient'
                         checked={role === 'patient'}
                         onChange={(e) => setRole(e.target.value)}
                         className='h-4 w-4 text-primary focus:ring-primary border-gray-300'
                        />
                        Patient
                    </label>
                    <label className='flex items-center gap-2 cursor-pointer'>
                        <input
                         type="radio"
                         value="caretaker"
                         checked={role === "caretaker"}
                         onChange={(e) => setRole(e.target.value)}
                         
                         className='h-4 w-4 text-primary focus:ring-primary border-gray-300'
                        />
                        Caretaker
                    </label>
                </div>
            </div>
        )}

        {
            state === 'signup' ? (
                <p>Already have account? <span onClick={() => setState('login')} className='text-primary cursor-pointer'>click here</span></p>
            ) : (
                <p>Create an account? <span onClick={() => setState('signup')} className='text-primary cursor-pointer'>click here</span> </p>
            )
        }


        <button className='bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer' type="submit">
            {state === 'signup' ? 'Create Account' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;
