import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const truncateTitle = (title) => {
  const maxLength = 50;
  if (title.length > maxLength) {
    return title.slice(0, maxLength) + '...';
  }
  return title;
};

const BlogDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    fetchBlogDetail();
  }, [id]);

  const fetchBlogDetail = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/blogs/${id}`);
      if (!response.ok) {
        throw new Error('Blog detallarını əldə etmək mümkün olmadı');
      }
      const data = await response.json();
      setBlog(data);

      // Əlaqəli blogları yüklə (məsələn, eyni kateqoriyadan olan bloglar)
      fetchRelatedBlogs(data.categoryId);
    } catch (error) {
      console.error('Blog detallarını yükləyərkən xəta baş verdi:', error);
    }
  };

  const fetchRelatedBlogs = async (categoryId) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/blogs'); // Əgər xüsusi bir əlaqəli bloglar endpointi varsa, burada düzəliş edin
      if (!response.ok) {
        throw new Error('Əlaqəli blogları əldə etmək mümkün olmadı');
      }
      const data = await response.json();
      // Eyni kateqoriyaya sahib olan, lakin cari blogu xaric edən blogları süzgəcdən keçir
      const filteredBlogs = data.filter(blog => blog.categoryId === categoryId && blog.id !== parseInt(id));
      setRelatedBlogs(filteredBlogs.slice(0, 3)); // 3 blog ilə məhdudlaşdır
    } catch (error) {
      console.error('Əlaqəli blogları yükləyərkən xəta baş verdi:', error);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
    scrollToTop();
  };

  if (!blog) {
    return <div className="BlogDetail container">Yüklənir...</div>;
  }

  return (
      <div className="BlogDetail container">
        <div className="centerblog">
          <div className="top">
            <div className="left">
              <img src="/default-author.png" alt="Yazar" />
              <div className="d">
                <span>Admin</span>
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="right">
              <img src="/k1.png" alt="" />
              <img src="/k2.png" alt="" />
              <img src="/k3.png" alt="" />
              <img src="/k4.png" alt="" />
            </div>
          </div>
          <h1>{blog.title}</h1>
          <img src={blog.imageUrl} alt="Blog" />
          <h4>Kateqoriya: {blog.categories_name}</h4>
          <p>{blog.content}</p>
        </div>

        <div className="top3blog container">
          <div className="endblog">
            {relatedBlogs.map((relatedBlog) => (
                <div
                    key={relatedBlog.id}
                    className="blog"
                    onClick={() => handleBlogClick(relatedBlog.id)}
                >
                  <img src={relatedBlog.imageUrl} alt={relatedBlog.title} />
                  <span>{relatedBlog.categories_name}</span>
                  <h4>{truncateTitle(relatedBlog.title)}</h4>
                  <div className="data">
                    <img src="/default-author.png" alt="Yazar" />
                    <span>Admin</span>
                    <span>{new Date(relatedBlog.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default BlogDetail;
