import { LoginPage } from './index.js'
import './App.css'
import { Toaster } from 'react-hot-toast'

function App() {

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />
  
     </div> 
  )
}

export default App
