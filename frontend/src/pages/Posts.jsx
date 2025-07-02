import { useState, useEffect } from "react"
import axios from 'axios';
import RenderedEditorJsContent from "../components/RenderedEditorJsContent";

const Posts = ({ backEndUrl }) => {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${backEndUrl}/api/posts`);
        setPosts(response.data); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false); 
      }
    };
    
    fetchPosts();
  }, [backEndUrl]);

  return (
    <>
      {loading && <p>Loading...</p>}
      {!loading && posts.length === 0 && <p>No posts found</p>}
      <ul>
        {!loading && posts.length !== 0 &&
          posts.map((post) => (
            <li key={post._id}>
              <RenderedEditorJsContent editorJsData={post.content} />
              <p>{new Date(post.createdAt).toLocaleString()}</p>
            </li>
          ))
        }
      </ul>
    </>
  )
}
export default Posts