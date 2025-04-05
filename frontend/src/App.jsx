import './App.css';
import { useEffect, useReducer, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Active from './components/Active';
import Completed from './components/Completed';
import AllTask from './components/AllTask';
import Layout from './components/Layout';
import TaskContext from './context/TaskContext';
import TokenContext from './context/TokenContext';
import taskReducer from './reducer/taskReducer';
import tokenReducer from './reducer/tokenReducer';
import userReducer from './reducer/userReducer';
import Header from './components/Header/Header';
import Login from './components/Login';
import Register from './components/Register';
import axios from './Axios/axios.js';
function App() {
  const token = JSON.parse(localStorage.getItem("authToken"));
  const [tasks, dispatch] = useReducer(taskReducer, [])
  const [userToken, tokenDispatch] = useReducer(tokenReducer, token)
  const [user, userDispatch] = useReducer(userReducer, {})
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/user/getUser",{
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        })
        userDispatch({type: "SET_USER", payload:res.data.user})
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    if (userToken) {
      fetchUser()
    } else {
      setIsLoading(false);
    }
  },[userToken])
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("/task/getTask", {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        })
        dispatch({ type: "SET_TASK", payload: res.data })
      } catch (error) {
        console.log(error);
      }
    }
    if (userToken) {
      fetchTasks()
    }
  },[userToken])
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <div className="bg-white p-8 rounded-lg shadow-2xl flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-800">Loading your tasks...</h2>
          <p className="text-gray-500 mt-2">Please wait while we prepare your workspace</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <TokenContext.Provider value={{userToken, tokenDispatch, user, userDispatch}}>
        <TaskContext.Provider value={{ tasks, dispatch }}>
          <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 text-gray-900">
            <Routes>
              <Route path="/" element={<Header />}>
                <Route path='/' element={token ? <Layout /> : <Login />}>
                  <Route index element={<AllTask />} />
                  <Route path="active" element={<Active />} />
                  <Route path="completed" element={<Completed />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>
            </Routes>
          </div>
        </TaskContext.Provider>
      </TokenContext.Provider>
    </BrowserRouter>
  );
}

export default App;



//Ready to deploy