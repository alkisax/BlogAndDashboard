import EditorJs from "../components/EditorJs";

function HomePage({ editorJsData, setEditorJsData }) {

  return (
    <>
      <EditorJs 
        editorJsData={editorJsData} 
        setEditorJsData={setEditorJsData}
      />
      <p>!Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi minus illum nisi est? At quisquam id nulla molestias delectus, rerum quas provident illo corrupti dolor minus, sint vero obcaecati incidunt?</p>
    </>
  );
}

export default HomePage;
