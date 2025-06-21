import { useState } from 'react'
import './App.css'
import {BrowserRouter, Routes, Route} from "react-router";
import HomePage from './pages/HomePage';

function App() {
   const [editorJsData, setEditorJsData] = useState({})

  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={<HomePage 
                editorJsData={editorJsData} 
                setEditorJsData={setEditorJsData}
              />}
            />
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
