import { useState } from 'react'
import './App.css'
import {BrowserRouter, Routes, Route} from "react-router";
import HomePage from './pages/HomePage';
import Posts from './pages/Posts'

function App() {
  const [editorJsData, setEditorJsData] = useState({})

  const backEndUrl = 'http://localhost:3001'

  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={<HomePage 
                editorJsData={editorJsData} 
                setEditorJsData={setEditorJsData}
                backEndUrl={backEndUrl}
              />}
            />

            <Route
              path="/posts"
              element={<Posts 
                backEndUrl={backEndUrl}
              />}
            />

            <Route path="/posts/:id" element={<BlogPost backEndUrl={backEndUrl} />} />
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
