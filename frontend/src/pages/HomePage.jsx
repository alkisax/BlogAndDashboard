import EditorJs from "../components/EditorJs";

function HomePage({ editorJsData, setEditorJsData, backEndUrl }) {

  return (
    <>
      <div>
        <h3>View all posts</h3>

      </div>

      <EditorJs 
        editorJsData={editorJsData} 
        setEditorJsData={setEditorJsData}
        backEndUrl={backEndUrl}
      />
      <p>!Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi minus illum nisi est? At quisquam id nulla molestias delectus, rerum quas provident illo corrupti dolor minus, sint vero obcaecati incidunt?</p>
    </>
  );
}

export default HomePage;
