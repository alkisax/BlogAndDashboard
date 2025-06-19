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