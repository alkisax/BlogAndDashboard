import React, { useRef } from 'react';
import axios from 'axios';
import RenderedEditorJsContent from './RenderedEditorJsContent'
import { useInitEditor } from '../hooks/useInitEditor';

import EditorJS from '@editorjs/editorjs';

const EditorJs = ({ editorJsData, setEditorJsData, backEndUrl }) => {
  // χρειάζομαι μια μεταβλητή για να φορτωσω το Instance απο τον κειμενογράφο
  const editorRef = useRef(null);

  // ✅ σε χωριστό custom hook μεταφέρθηκε όλη η παραμετροποίηση του editorJs
  useInitEditor(editorRef, backEndUrl);

  const handlePreview = async () => {
    const outputData = await editorRef.current.save()
    localStorage.setItem('editorData', JSON.stringify(outputData));
    setEditorJsData(outputData);
  }

  const handleSubmit = async () => {
    if(editorRef.current) {
      try {
        //  η save() ερχεται απο τον editorjs και επιστρέφει μια υπόσχεση με τα δεδομένα του editor
        const outputData = await editorRef.current.save()
        localStorage.setItem('editorData', JSON.stringify(outputData));
        setEditorJsData(outputData);
        console.log('Data saved:', outputData);

        // για την αποθήκευση στην Mongo
        await axios.post(`${backEndUrl}/api/posts`, {
          content: outputData
        })
        
        // για επιπλέων αποθήκευση εικόνων στην mongoDB ως base64. Τo axios παραπάνω τα σώζει ως λινκ. πχ http://localhost:3001/uploads/image-1751308923423.jpg
        const imageBlocks = outputData.blocks.filter(block => block.type === 'image')

        for (const block of imageBlocks) {
          const imageUrl = block.data.file.url
          try {
            // 👇 ΠΑΡΕ ΤΗΝ ΕΙΚΟΝΑ ως arraybuffer (BINARY)
            const imageResponse = await axios.get(imageUrl, {
              responseType: 'arraybuffer'
            })

            // 👇 Convert binary to Blob/File
            const mimeType = block.data.file.mime || 'image/jpeg';
            const buffer = imageResponse.data;
            const file = new File([buffer], 'editor-image.jpg', { type: mimeType });

            // 👇 Upload using FormData (required for multer backend)
            const formData = new FormData();
            formData.append('image', file);
            formData.append('name', block.data.caption || 'Image');
            formData.append('desc', block.data.caption || '');

            await axios.post(`${backEndUrl}/api/images`, formData)
            console.log('✅ Image sent as JSON to MongoDB');
          } catch (err) {
            console.error('❌ Failed to upload image:', err);
          }
        }
      } catch (error) {
        console.error("saving failed", error)
      };
    }
  }

  return (
    <>
      <div>
        <div 
          id="editorjs" 
          style={{ border: '2px solid blue', padding: '4px', minHeight: '300px' }} 
        />
        <div className='btnDiv flex gap-3 mx-3 justify-center'>
          <button onClick={handlePreview}>
            preview
          </button>
          <button onClick={handleSubmit}>
            submit
          </button>
        </div>
      </div>

      <div>
        <RenderedEditorJsContent editorJsData={editorJsData} />
      </div>
    </>
  )
}
export default EditorJs