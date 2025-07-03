import axios from 'axios';
import { useState, useEffect } from "react"
import { useParams } from 'react-router-dom';
import RenderedEditorJsContent from "../components/RenderedEditorJsContent";

const BlogPost = ({ backEndUrl }) => {
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState(null)

  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${backEndUrl}/api/posts/${id}`);
        setPost(response.data); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false); 
      }
    };
    
    if (id) {
      fetchPost();
    }
  }, [backEndUrl, id]);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-center">All Posts</h1>
      <div className="p-4 max-w-4xl mx-auto">
        {loading && <p>Loading...</p>}
        {!loading && !post && <p>Blog post was not found</p>}

        <div className="grid gap-6">
            {!loading && post &&

                <div 
                  key={post._id}
                  className="bg-slate-100 text-black shadow-md rounded-2xl p-6 border border-gray-300 hover:shadow-lg transition-shadow"
                >
                  <RenderedEditorJsContent editorJsData={post.content} />
                  <p className="text-sm text-gray-500 mt-4">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>

            }        
        </div>    
      </div>
    </>
  )
}

export default BlogPost
