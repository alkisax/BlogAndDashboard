import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';

import Paragraph from '@editorjs/paragraph';
import Header from '@editorjs/header';
import List from '@editorjs/list';

function HomePage() {
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) {
      // Initialize EditorJS instance, attach to div#editorjs
      editorRef.current = new EditorJS({
        holder: 'editorjs',
        tools: {
          paragraph: Paragraph,
          header: Header,
          list: List,
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
      <h2>Manual Editor.js in React</h2>
      {/* This div is where Editor.js will render */}
      <div id="editorjs" style={{ border: '1px solid #ccc', padding: '10px', minHeight: '300px' }} />
    </>
  );
}

export default HomePage;
