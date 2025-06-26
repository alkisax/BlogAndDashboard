# Git
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
- στο main, μπορείς να πεις στο Git:
```bash
git checkout main
# Αυτό αντιγράφει ΟΛΑ τα αρχεία από το wip στο main χωρίς ιστορικό, σαν να έγραψες το νέο κώδικα τώρα.
git checkout wip -- .
git add .
git commit -m "feat: Add EditorJS blog component with image and layout"
git push origin main
```
- αυτή η λύση δεν μου αρέσει πολύ αλλα θα το δω ξανα στο επόμενο σοβαρο commit γιατί τώρα δούλεψε

# δημιουργία βασικού frontend/backend
### backend
```
npm init
```
### frontend
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

# δοκιμή με editor js
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
npm install editorjs-paragraph-with-alignment@3
npm install editorjs-indent-tune
```
- **IMPORTNAT** χρειάζετε να προσθέσω styling στο css (όπως και χρειάζετε δικό του css κομμάτι κάθε add on του editorJs)
#### frontend\src\App.css
```css
/* editor js css */
.ce-paragraph[data-align="justify"],
.ce-block--aligned-justify {
  text-align: justify;
}
/* Στυλ για ολόκληρο το editor container — εμφανές περίγραμμα, padding και ελάχιστο ύψος */
.codex-editor {
  border: 1px solid #ccc;
  padding: 16px;
  min-height: 300px;
}
/* Ευθυγράμμιση των blocks με βάση την επιλογή του χρήστη από το εργαλείο alignment */
.ce-block--aligned-left {
  text-align: left;
}
.ce-block--aligned-right {
  text-align: right;
}
/* end of editor js css */
```

- **IMPORTNAT** χρειάζετε να προσθέσω     `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest/dist/editor.css">` στο frontend\index.html  

#### frontend\src\components\EditorJs.jsx
```jsx
import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';

// import Paragraph from '@editorjs/paragraph';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import ImageTool from '@editorjs/image';

import AlignmentTuneTool from 'editorjs-text-alignment-blocktune'; // δεν είχε justify alignment αλλά είχε διαφορ καλά για headers και list Οπότε το κρατάω και χρησιμοποιω το Pargraph-with-alignment για το justify
import Paragraph from 'editorjs-paragraph-with-alignment';

const EditorJs = ({ editorJsData, setEditorJsData }) => {
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
              placeholder: 'Start writing your text here...',
            },
            // tunes: ['indentTune'],
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



## αποθήκευση του editor στο localmemory και προβολή του
για την αποθήκευση στη μνήμη είτε ως useState είτε ως localStorage στο
#### frontend\src\App.jsx
```jsx
const [editorJsData, setEditorJsData] = useState({})
//...
  <Route 
    path="/" 
    element={<HomePage 
      editorJsData={editorJsData} 
      setEditorJsData={setEditorJsData}
    />}
```
#### frontend\src\pages\HomePage.jsx
```jsx
      <EditorJs 
        editorJsData={editorJsData} 
        setEditorJsData={setEditorJsData}
      />
```
#### frontend\src\components\EditorJs.jsx
```jsx
  const handleSubmit = async () => {
    if(editorRef.current) {
      try {
        //  η save() ερχεται απο τον editorjs και επιστρέφει μια υπόσχεση με τα δεδομένα του editor
        const outputData = await editorRef.current.save()
        localStorage.setItem('editorData', JSON.stringify(outputData));
        setEditorJsData(outputData);
        console.log('Data saved:', outputData);
        console.log('editorJsData', editorJsData);
        
      } catch (error) {
        console.error("saving failed", error)
      };
    }
  }
//...
      <div>
        <div 
          id="editorjs" 
          style={{ border: '2px solid blue', padding: '4px', minHeight: '300px' }} 
        />
        <button onClick={handleSubmit}>
          submit
        </button>
      </div>
```

## δοκιμαστική προβολή του περιεχομένου του editorJs σε div
φτιάχτικε χειροκίνητα (με μπόλικο gpt) ένας renderer
#### frontend\src\components\EditorJs.jsx
```jsx
      <div>
        <h2>EditorJs Data</h2>
        {/* 
         to render ηταν δύσκολο και συμβουλευτικα αρκετα το gpt
        αρχικα ελέγχουμε αν υπάρχει state editorJsData και αν αυτό το state έχει μέσα του blocks
        και μετά με μια map παίρνουμε το κάθε block και το render-αρουμε ανάλογα με τον τύπο του block χρησιμοποιόντας διάφορες συνθήκες if 
        */}
        {editorJsData?.blocks?.map((block, index) => {
          if (block.type === 'paragraph') {
            // με μια console.log είδα  το alignmeent και το παιρνω απο το block.tunes.alignment
            const alignStyle = {
              textAlign: block.data.alignment || 'left',
            };
            return (
              <p 
                key={index}
                style={alignStyle}
              >
                  {block.data.text}
              </p>
            )
          }
          if (block.type === 'header') {
            // επειδή τα h1 h2 κλπ δεν είναι απλά attributes αλλά θα έχουν την μορφή <h1> κλπ φτιάχνω ένα tag για να γίνει <Tag>
            // εδω το alignment είναι tune γιατι το παίρνει απο AlignmentTuneTool
            const Tag = `h${block.data.level || 2}`;
            const alignment = block.tunes?.alignment?.alignment || 'left';
            return (
              <Tag 
                key={index}
                style={{ textAlign: alignment }}
              >
                {block.data.text}
              </Tag>
            )
          }
          // το List ήταν αρκετά πολυπλοκο γιατί χρειαζόταν να ελεξω αν είναι ordered η unorder και αν είναι checkbox, όπου αν είναι αν είναι checked και μετά να κάνω το ανάλογο map για την παραγωγή της λίστας
          if (block.type === 'list') {
            const alignment = block.tunes?.alignment?.alignment || 'left';
            const alignStyle = { textAlign: alignment };

            if (block.data.style === 'checklist') {
              // console.log(block.data.items);
              // το i είναι ένα index (1,2,3...)
              const items = block.data.items.map((item, i) => {
                //Το !! στh JS κάνει μετατροπή οποιασδήποτε τιμής σε boolean.
                const isChecked = !!item.meta?.checked; 

                return (
                  <li 
                    key={i} 
                    style={{ listStyleType: 'none', display: 'flex', alignItems: 'center' }}
                  >
                    <input 
                      type="checkbox" 
                      disabled 
                      checked={isChecked} 
                      style={{ marginRight: 8 }} 
                    />
                    <span>{item.content}</span>
                  </li>
                );
              });
              // έχει δύο return μια μέσα στο map όπου σε κάθε βήμα μου φτιάχνει το κάθε μεμονομένο li  και μετ ατο προσθέτει στην items και ένα τελικό return έξω αππο την map όπου παράγει την ul
              return <ul key={index} style={alignStyle}>{items}</ul>;
            } else {
              // normal ordered/unordered list
              const items = block.data.items.map((item, i) => {
                const text = typeof item === 'string' ? item : item?.content || '[invalid item]';
                return <li key={i}>{text}</li>;
              });

              return block.data.style === 'ordered' ? (
                <ol key={index} style={alignStyle}>{items}</ol>
              ) : (
                <ul key={index} style={alignStyle}>{items}</ul>
              );
            }
          }
          // TODO
          if (block.type === 'image') {
            return (
              <div key={index}>
                <img src={block.data.file.url} alt={block.data.caption || ""} style={{ maxWidth: '100%' }} />
                {block.data.caption && <p>{block.data.caption}</p>}
              </div>
            );
          }
          if (block.type === 'inlineCode') {
            return <code key={index}>{block.data.code}</code>;
          }
          return null;
        })}
      </div>
```

#### .env
```
MONGODB_URI = mongodb+srv://alkisax:{---}@cluster0.8ioq6.mongodb.net/blogAndDashboard?retryWrites=true&w=majority&appName=Cluster0
MONGODB_TEST_URI = mongodb+srv://alkisax:{---}@cluster0.8ioq6.mongodb.net/blogAndDashboard_TEST?retryWrites=true&w=majority&appName=Cluster0

BACK_END_PORT = 3001
APP_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001
```
# Back end για upload εικονων σε φακελο και mongo

## dependancies back
```bash
npm install express
npm install body-parser
npm install mongoose
npm install multer
npm install dotenv
npm install cors
npm install swagger-ui-express
npm install mongoose-to-swagger
npm install swagger-jsdoc
npm install --save-dev jest
```


- τα δύο παρακάτω αρχεία τα αντέγραψα απο το angularTodoApp
- χρησιμοποίησα το tutorial `https://www.geeksforgeeks.org/upload-and-retrieve-image-on-mongodb-using-mongoose/`

#### backend\server.js
```js
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app'); 

const PORT = process.env.BACK_END_PORT || 3001

mongoose.set('strictQuery', false);
// συνδεση με την MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
    console.log('Routes setup complete. Starting server...');
// εδώ είναι το βασικό listen PORT μου
    app.listen(PORT, () => {
      // το εκανα σαν λινκ για να είναι clickable
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('error connecting to MongoDB:', error.message);
  });
```

#### backend\app.js
```js
const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./utils/swagger');
// θα προστεθούν πολλα τέτοια endpoints οπως προχωρά η εφαρμογη
// const todoRoutes = require('./routes/todo.routes')
const imgRoutes = require('./routes/img.routes'); 

// αυτό ειναι κάτι που ίσως μου χρειαστεί στο deploy και δεν το καταλαβαίνω καλα. (και παρακάτω μαζί με αυτό)
const path = require('path'); // requires explanation. added for rendering front page subpages

const app = express()
app.use(cors())
app.use(express.json());

// ενας logger για να καταγράφει το backend τις κλήσεις
app.use((req, res, next) => {
  console.log("Request reached Express!");
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

// θα προστεθούν πολλα τέτοια endpoints οπως προχωρά η εφαρμογη
// app.use('/api/todo', todoRoutes)
app.use('/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
})
app.use('/api/images', imgRoutes)

// swagger test page
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// για να σερβίρει τον φακελο dist του front μετα το npm run build
app.use(express.static('dist'))

//αυτο είναι για να σερβίρει το index.html του front όταν ο χρήστης επισκέπτεται το root path ή οποιοδήποτε άλλο path που δεν είναι api ή api-docs
app.get(/^\/(?!api|api-docs).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

module.exports = app
```
## Upload και Mongo

- θα φτιαξώ μια βασική αρχιτεκτονική. 
1. το backend\services\multer.service.js είναι υπεύθυνο για να κάνει το upload και την αποθήκευση της εικόνας
2. το backend\models\img.model.js εχει το mongoose schema και έχει τις εντολές της mongoose
3. το backend\daos\img.dao.js λυτουργεί ως ενδιάμεσο dao με την βαση δεδομένων για λόγους ασφαλείας (ή αλλαγής βάσης)
4. το backend\controllers\img.controller.js εχει μέσα την λογική μου και ασχολείτε με το upload και render (καλόντας το dao)
5. backend\routes\img.routes.js τα paths μου, η αντιστοίχηση με τις εντολες του controller 
6. backend\utils\swagger.js

1. #### το backend\services\multer.service.js 
```js
const multer = require('multer');
const path = require('path');

// μέθοδος που δημιουργεί έναν τρόπο αποθήκευσης αρχείων στο δίσκο (στον υπολογιστή). Με αυτήν καθορίζουμε πού θα αποθηκευτεί το αρχείο και πώς θα ονομαστεί.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('reached multer service');   
    // null -> το δεχόμαστε, path.join(__dirname, '../uploads') -> ο φάκελος που θα αποθηκευτούν τα αρχεία
    cb(null, path.join(__dirname, '../uploads'));
  },
  // πως θα ονομαστεί το αρχείο όταν αποθηκευτεί
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});

// αυτό είναι ένας middleware που θα πιάσει το αρχείο που θα στείλει ο χρήστης και θα το αποθηκεύσει στον φάκελο uploads
const upload = multer({ 
  // καθοριζει που θα αποθηκεύονται τα αρχεία οριζετε στην παραπάνω const
  storage,
  // Το fileFilter είναι μια συνάρτηση που ελέγχει κάθε αρχείο πριν αποθηκευτεί.
  fileFilter: (req, file, cb) => {
    console.log('reached multer upload');
    // παιρνει τοn τύπο του αρχειου πχ png jpg κλπ
    const ext = path.extname(file.originalname);
    console.log('Uploading file:', file.originalname, file.mimetype);
    // callback συνάρτηση που πρέπει να καλέσεις για να πεις αν αποδεχεσαι το αρχείο ή όχι.
    cb(null, true);
  }
});

module.exports = upload;


/*
Παράδειγμα φίλτρου που δέχεται μόνο εικόνες .jpg ή .png
js
Αντιγραφή κώδικα
fileFilter: (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if(ext === '.jpg' || ext === '.jpeg' || ext === '.png'){
    cb(null, true); // αποδεκτό αρχείο
  } else {
    cb(new Error('Only images are allowed'), false); // απορρίπτω
  }
}
*/
```

2. #### backend\models\img.model.js
```js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  name: String,
  desc: String,
  img: {
    data: Buffer,
    contentType: String
  }
});

module.exports = mongoose.model('Image', imageSchema);
```

3. #### backend\daos\img.dao.js
```js
const Image = require('../models/img.model');

const getAllImages = () => {
 return Image.find({});
}
const createImage = (imageData) => {
  return Image.create(imageData)
};

module.exports = {
  getAllImages,
  createImage
};
```

4. #### backend\controllers\img.controller.js
```js
// fs = files system
const fs = require('fs').promises;  // note: require fs.promises
// Node.js's built-in path module, which helps you safely work with file and folder paths
const path = require('path');
const imgDao = require('../daos/img.dao');

//TODO LATER
const renderImagePage = async (req, res) => {
  try {
    const items = await imgDao.getAllImages();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};


const uploadImage = async (req, res) => {
  console.log('enter uploadImage controller' );
  //ελενγχουμε το req απο τον client αν έχει οτι χρειάζεται
  try {
    if (!req.file || !req.body.name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // το filepath και το obj τα παίρνουμε από το req.file που έχει δημιουργηθεί από το multer middleware
    const filePath = req.file.path; 
    console.log('File path:', filePath);
    
    //Όταν το readFile() τελειώσει: Αν όλα πήγαν καλά, αποθηκεύει το περιεχόμενο του αρχείου (σε μορφή Buffer) στη μεταβλητή data. Αυτός ο Buffer είναι το "raw binary" του αρχείου. Αν και το multer έχει ήδη αποθηκεύσει το αρχείο στο φάκελο uploads, εμείς εδώ το διαβάζουμε ξανά: 👉 για να το μετατρέψουμε σε binary δεδομένα,👉 ώστε να το αποθηκεύσουμε μέσα στη MongoDB (σε ένα document, όχι ως αρχείο στο δίσκο).
    // Συμαντικό: για να λειτουργήσει το fs.readFile() πρέπει να χρησιμοποιήσουμε την υπόσχεση (Promise) του fs.promises, όχι το απλό fs: επάνω στις δηλώσεις: const fs = require('fs').promises;
    const data = await fs.readFile(filePath); 
    console.log('data:', data);
    

    const obj = {
      name: req.body.name,
      desc: req.body.desc || '',
      img: {
        data,
        contentType: req.file.mimetype
      }
    };
    console.log('Image object:', obj);
    
    // εδω με το imgDao το στελνουμε στην mongo ή αποθήκευση ως αρχείο έχει γίνει ήδη απο τον multer middleware
    await imgDao.createImage(obj);
    res.status(200).json({ message: 'image uploaded' });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).send('Upload failed');
  }
};


module.exports = {
  renderImagePage,
  uploadImage
};
```

5. #### backend\routes\img.routes.js
```js
const express = require('express');
const router = express.Router();
const upload = require('../services/multer.service');
const imgController = require('../controllers/img.controller');

/**
 * @swagger
 * /api/images:
 *   get:
 *     summary: Get all uploaded images
 *     tags: [Images]
 *     responses:
 *       200:
 *         description: A list of uploaded images
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Image'
 *       500:
 *         description: Server error
 */
router.get('/', imgController.renderImagePage);

/**
 * @swagger
 * /api/images:
 *   post:
 *     summary: Upload a new image
 *     tags: [Images]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               desc:
 *                 type: string
 *               image:
 *                 type: file
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       500:
 *         description: Upload failed
 */
router.post('/', upload.single('image'), imgController.uploadImage);

module.exports = router;
```

6. #### backend\utils\swagger.js

```js
const m2s = require('mongoose-to-swagger');
const Image = require('../models/img.model')
const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      version: "1.0.0",
      title: "blog and dashboard",
      description: "basic dahshboard",
    },
    components: {
      schemas: {
        Image: m2s(Image)
      },
    },
  },
  // 👇 This is the critical part: tell swagger-jsdoc where to find your route/controller annotations
  apis: ['./routes/*.js', './controllers/*.js'], // adjust paths if needed
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
```

## εμφάνηση του περιεχομένου σε άλλο div και αλλαγές στο upload

#### backend\controllers\img.controller.js
```js
//εδω μικρή αλλαγή
    if (!req?.file?.path) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
// το res πρέπει να γίνει σε άλλη μορφή για να ταιριάζει με τις προυποθέσεις του editroJs
    res.status(200).json({
      success: 1,
      file: {
        url: `http://localhost:3001/uploads/${req.file.filename}`,
      },
    });
```

#### backend\controllers\img.controller.js
```jsx
          if (block.type === 'image') {
            return (
              <div key={index}>
                <img 
                  src={block.data.file.url} 
                  alt={block.data.caption || ""} 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '400px',    // <-- Εδώ το πρόσθεσα
                    objectFit: 'contain'  // <-- Εδώ το πρόσθεσα
                  }} 
                />
                {block.data.caption && <p>{block.data.caption}</p>}
              </div>
            );
          }
```

- για να μην φαίνετε μεγάλο και στον editorJs έκανα μια μικρή προσθήκη στο css
#### frontend\src\App.css
```css
/* προοστέθηκε για έλεγχο μεγέθους εικόνας */
.ce-block__content img {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
}
```

**επόμενο βήμα αποθήκευση στην mongo κειμένου και εικόνας**
πρότα θα φτιαχτεί ένα backend με url στο app.js και model dao controler και routes και μετά θα μπεί το post σε ένα useState και θα σταλθεί στο back με ένα useEffect


