import React from "react";

const RenderedEditorJsContent = ({ editorJsData }) => {

  return (
    <>
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
export default RenderedEditorJsContent