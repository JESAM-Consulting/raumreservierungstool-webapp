import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { RouterProvider } from 'react-router-dom'
import router from './routes/routes'
import '../styles/mixins/index.scss';
function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App

export const ApiRoutes = "https://api.fe-scheduler.rejoicehub.com/api/v1"
// export const ApiRoutes = "http://192.168.29.173:8093/api/v1"