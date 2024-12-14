import React from 'react';
import slidesData from './Home-Json/slider.json'; 

const Slider = () => {
  return (
    <div className='Home-end '>
      <div className="title">
        <h1>Burada, Orada, Hər Yerdə</h1>
        <p>Audio qlobaldır, biz də belə. Dünyanın harasında yeni bir iş axtarırsınızsa, çox güman ki, biz oradayıq.</p>
        <button>Bütün Yerləri Göstər</button>
      </div>

      <div className="slides">
        {slidesData.map((slide) => (
          <div key={slide.order} className="slide">
            <img src={slide.image} alt={slide.location} />
            <span className='location'>{slide.location}</span>
            <span className='order'>{slide.order}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
