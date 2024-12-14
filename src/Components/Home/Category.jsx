import React from 'react';
import { useNavigate } from 'react-router-dom';

const Category = () => {
  const navigate = useNavigate();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    { id: 1, image: '/i1.png', title: 'Biznesin İnkişafı' },
    { id: 2, image: '/i2.png', title: 'Müştəri Xidməti' },
    { id: 3, image: '/i3.png', title: 'Dizayn' },
    { id: 4, image: '/i4.png', title: 'Əməliyyatlar' },
    { id: 5, image: '/i5.png', title: 'İnkişaf' },
    { id: 6, image: '/i6.png', title: 'Mobil İnkişaf' }
  ];

  const handleSeeAllClick = () => {
    navigate('/seekfunding'); 
    scrollToTop()
  };

  return (
    <div className='category container'>
      <div className="category-left">
        <h1>Kateqoriyalara Görə Kəşf edin</h1>
        <p>Seçdiyiniz sahədə yeni imkanlar kəşf edin.</p>
        <div className="see" onClick={handleSeeAllClick}>
          <span>Bütün Kateqoriyalara Bax</span>
          <img src="/arrow-right.png" alt="Sağa ox" />
        </div>
      </div>
      <div className="category-right">
        {categories.map((category) => (
          <div key={category.id} className="one">
            <img src={category.image} alt={category.title} />
            <span>{category.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;