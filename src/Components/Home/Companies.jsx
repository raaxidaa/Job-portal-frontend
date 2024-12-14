import React from 'react';
import { useNavigate } from 'react-router-dom';
import data from './Home-Json/Companies.json'; 

const Companies = () => {
  const navigate = useNavigate();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleSeeAllClick = () => {
    scrollToTop()
    navigate('/company'); 
  };

  return (
    <div className='companies container'> 
      <div className="companies-top">
        <h1>Populyar Şirkətlərə Bax</h1>
        <div className="see-company" onClick={handleSeeAllClick}>
        <span>Şirkətlər haqqında ətraflı məlumat əldə etmək üçün bura klikləyin.</span>
          <span>Bütün Şirkətləri Göstər</span>
          <img src="/arrow-right.png" alt="" />
        </div>
      </div>
      <div className="companies-bottom">
        {data.map((company) => (
          <div key={company.id} className="two">
            <div className="two-top">
              <img src={company.image} alt={company.name} />
              <span>{company.name}</span>
            </div>
            <p>{company.description}</p>
            <div className="two-bottom">
              <span>{company.jobs}</span>
              <img src="/arrow-right-up.png" alt="" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Companies;
