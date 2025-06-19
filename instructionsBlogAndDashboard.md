```
npm init
```
```
git init
git remote add origin git@github.com:alkisax/BlogAndDashboard.git
git pull origin main
git add .
git commit -m "Initial commit"
git checkout -b wip
```
- Με `git log --oneline` βλεπω τα commit μου. Πχ
```bash
$ git log --oneline
dc0fb5a (HEAD -> wip, origin/wip) feat: Editorjs component - basic functionality
83739ba minor
84f1853 wip: failing on initial editor.js
86863f2 wip: create basics
fb442c7 (origin/main, main) Initial commit
d4ef566 Initial commit
```
- θελω να κάνω merge στο main μόνο το τελευταιο commit Που έχω κάτι διμηουργημένο


## δημιουργία frontend
```
npm create vite@latest frontend -- --template react
npm install
npm i react-router
```
#### frontend\src\App.jsx
εύτιαξα ένα στοιχειόδες App.jsx για να κάνω δοκιμές. αργότερα ισως αλλάξει
```jsx
// import { useState } from 'react'
import './App.css'
import {BrowserRouter, Routes, Route} from "react-router";
import HomePage from './pages/HomePage';

function App() {

  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />}/>
          </Routes>
      </BrowserRouter>
    </>
  )
}
export default App
```

## δοκιμή με editor js
```
npm install @editorjs/editorjs react-editor-js
npm install @editorjs/paragraph @editorjs/header @editorjs/list
npm i @editorjs/editorjs --save
```

#### frontend\src\pages\HomePage.jsx
- φτιάχνω ένα απλό HomePage Που καλεί ένα component EditorJs
```jsx
import EditorJs from "../components/EditorJS";

function HomePage() {

  return (
    <>
      <EditorJs />
      <p>!Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi minus illum nisi est? At quisquam id nulla molestias delectus, rerum quas provident illo corrupti dolor minus, sint vero obcaecati incidunt?</p>
    </>
  );
}

export default HomePage;
```

- σημειώσεις για useRef
Το useRef κρατά τιμές μεταξύ των renders χωρίς να προκαλεί νέο render, και συχνά χρησιμοποιείται για αναφορά σε HTML στοιχεία (π.χ. focus σε input).  
📌 Σημείωση: Αν χρησιμοποιήσεις useRef, η αλλαγή δεν θα εμφανιστεί στο DOM ή στο JSX εκτός αν αναγκάσεις re-render (π.χ. με useState).  
```jsx
  const [text, setText] = useState("");
  setText("Hello"); 
  const timeout = setTimeout(() => {
    setText(""); // Την αδειάζει ξανά μετά από λίγο
  }, 2000);

  const textRef = useRef("");
  textRef.current = "Hello"; 
  const timeout = setTimeout(() => {
    textRef.current = ""; // Ξαναμηδενίζει
  }, 2000);
```

### editorJs
- για να χρησιμοποιήσω των editorJs πρέπει αρχικά να κατεβάσω την βιβλιοθήκη και μετά κατευάζω μία μια τις διαφορετικές ιδιώτητές της:
```bash
npm install @editorjs/editorjs
npm install @editorjs/paragraph
npm install @editorjs/header
npm install @editorjs/list
npm install @editorjs/marker
npm install @editorjs/inline-code
npm install @editorjs/image
npm install editorjs-text-alignment-blocktune
```
- **IMPORTNAT** χρειάζετε να προσθέσω styling στο css
#### frontend\src\App.css
```css
/* editor js css */
.ce-block--aligned-left {
  text-align: left;
}

.ce-block--aligned-center {
  text-align: center;
}

.ce-block--aligned-right {
  text-align: right;
}

.ce-block {
  border: 1px solid #ddd;
  padding: 8px;
  margin-bottom: 8px;
}

.ce-toolbar__plus,
.ce-toolbar__settings-btn {
  display: inline-block;
}

.codex-editor {
  border: 1px solid #ccc;
  padding: 16px;
  min-height: 300px;
}
/* end of editor js css */
```

#### frontend\src\components\EditorJs.jsx
```jsx
import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';

import Paragraph from '@editorjs/paragraph';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import ImageTool from '@editorjs/image';

import AlignmentTuneTool from 'editorjs-text-alignment-blocktune';

const EditorJs = () => {
  // χρειάζομαι μια μεταβλητή για να φορτωσω το Instance απο τον κειμενογράφο
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) {
      // κάνω instanciete
      editorRef.current = new EditorJS({
        //IMPORTANT λέω τι id έχει το dom element μου στο οποίο θα εκχωρήσω τις ιδιοτητες του κειμενογράφου
        holder: 'editorjs',
        // μεσα sto tools βαζω ένα ένα τα εργαλέια 
        tools: {
          paragraph: {
            class: Paragraph,
            inlineToolbar: true, // This enables inline tools like bold/italic
            config: {
              placeholder: 'Start writing your awesome post here...',
            },
            tunes: ['alignment'],
          },
          header: {
            class: Header,
            inlineToolbar: true,
            config: {
              placeholder: 'Enter a title',
            },
            tunes: ['alignment'],
          },
          list: {
            class: List,
            inlineToolbar: true,
            tunes: ['alignment'],
          },
          marker: Marker,        // Highlight
          inlineCode: InlineCode, // Inline code block
          alignment: {
            class: AlignmentTuneTool,
            config: {
              default: 'left',
              blocks: {
                header: 'center',
                list: 'left',
              },
            },
          },
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: 'http://localhost:3000/uploadFile', // your backend endpoint
                byUrl: 'http://localhost:3000/fetchUrl',     // optional
              },
            }
          },
        },
        onReady: () => {
          console.log('Editor.js is ready');
        },
      });
    }

    // Cleanup when component unmounts
    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  return (
    
    <>
      <div 
        id="editorjs" 
        style={{ border: '2px solid blue', padding: '4px', minHeight: '300px' }} 
      />
    </>
  )
}
export default EditorJs
```

  
