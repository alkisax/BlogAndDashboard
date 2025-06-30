import React, { useEffect, useRef } from 'react';
import axios from 'axios';

import EditorJS from '@editorjs/editorjs';

// για να μετατρέψω το editorJsData data σε html
// import edjsParser from 'editorjs-parser';

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

  const backEndUrl = 'http://localhost:3001'

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
              default: 'right',
              blocks: {
                header: 'left',
                list: 'left',
              },
            },
          },
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: `${backEndUrl}/api/images`, // your backend endpoint
                // byUrl: 'http://localhost:3000/fetchUrl',     // optional
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

  const handleSubmit = async () => {
    if(editorRef.current) {
      try {
        //  η save() ερχεται απο τον editorjs και επιστρέφει μια υπόσχεση με τα δεδομένα του editor
        const outputData = await editorRef.current.save()
        localStorage.setItem('editorData', JSON.stringify(outputData));
        setEditorJsData(outputData);
        console.log('Data saved:', outputData);
        console.log('editorJsData', editorJsData);

        // για την αποθήκευση στην Mongo
        await axios.post(`${backEndUrl}/api/routes`, {
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
        <button onClick={handleSubmit}>
          submit
        </button>
      </div>

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
          if (block.type === 'inlineCode') {
            return <code key={index}>{block.data.code}</code>;
          }
          return null;
        })}
      </div>

    </>
  )
}
export default EditorJs