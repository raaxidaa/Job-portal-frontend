import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Blogs = () => {
  const [selectedCategory, setSelectedCategory] = useState('Bütün');
  const [blogs, setBlogs] = useState([]); // API'den alınan blogları tutacak durum
  const [filteredBlogs, setFilteredBlogs] = useState([]); // Filtrelenmiş bloglar için durum
  const navigate = useNavigate();

  const truncateTitle = (title) => {
    return title.length > 40 ? title.substring(0, 40) + '...' : title;
  };

  // API'den blogları al
  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/blogs');
        if (!response.ok) {
          throw new Error('Bloglar alınırken hata oluştu');
        }
        const data = await response.json();
        setBlogs(data);
        setFilteredBlogs(data); // Başlangıçta tüm blogları göster
      } catch (error) {
        console.error('Bloglar alınırken hata oluştu:', error);
      }
    }

    fetchBlogs();
  }, []);

  // Seçilen kategoriye göre blogları filtrele
  useEffect(() => {
    if (selectedCategory === 'Bütün') {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(
          blogs.filter(blog => blog.categories_name === selectedCategory)
      );
    }
  }, [selectedCategory, blogs]);

  const handleBlogClick = (id) => {
    navigate(`/blog/${id}`);
  };

  return (
      <div className="Blogs container">
        <h4>Ən Son Məlumatlar</h4>
        <div className="filters">
          <span onClick={() => setSelectedCategory('Bütün')}>Bütün</span>
          {/* Bloglara əsasən kateqoriyaları dinamik olaraq yaradın */}
          {Array.from(new Set(blogs.map(blog => blog.categories_name))).map(category => (
              <span key={category} onClick={() => setSelectedCategory(category)}>
            {category}
          </span>
          ))}
        </div>
        <div className="center">
          {filteredBlogs.map(blog => (
              <div key={blog.id} className="blog" onClick={() => handleBlogClick(blog.id)}>
                <img src={blog.imageUrl} alt={blog.title} />
                <span>{blog.categories_name}</span>
                <h4>{truncateTitle(blog.title)}</h4>
                <div className="data">
                  <img src="/default-author.png" alt="Yazar" />
                  <span>Admin</span>
                  <span>on {new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
};
