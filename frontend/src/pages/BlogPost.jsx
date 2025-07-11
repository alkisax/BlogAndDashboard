import axios from 'axios';
import { useState, useEffect } from "react"
import { useParams, useNavigate  } from 'react-router-dom';
import RenderedEditorJsContent from "../components/RenderedEditorJsContent";

const BlogPost = ({ backEndUrl }) => {
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState(null)

  const { id } = useParams();
  const navigate = useNavigate();

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

  const navigateToHome = () => {
    navigate('/');
  }

  const editPost = () => {
    navigate(`/edit/${id}`);
  }

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
                  <div className='btnDiv flex gap-3 mx-3 justify-center'>
                    <button 
                      onClick={navigateToHome}
                      className='bg-blue-500 text-white px-4 py-2 rounded'
                    >
                      Home
                    </button>
                    <button 
                      onClick={editPost}
                      className='bg-blue-500 text-white px-4 py-2 rounded'
                    >
                      Edit
                    </button>
                  </div>
                </div>

            }        
        </div>    
      </div>
    </>
  )
}

export default BlogPost
