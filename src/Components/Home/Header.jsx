import React, { useState, useEffect } from 'react';
import sponsorImages from './Home-Json/sponsorImages.json';

const Header = () => {
  const [images, setImages] = useState([]);
  useEffect(() => { setImages(sponsorImages); }, []);

  return (
    <div className='header'>
      <div className="header-left container" >
        <span>2886 vakansiya</span>
        <h1>
        Növbəti fürsətinizi{' '}
          <img src="/Burst-pucker-2.png" alt="" />
        həyəcanverici startup işini kəşf edin.
        </h1>
        <p>
        Növbəti iş imkanınız bir klik uzağınızda!
        </p>
        <div className="search">
          <img src="/search.png" alt="" />
          <input type="text" name="search" id="search" placeholder="Şirkət ,iş adı" />
          <img src="/map-pin-3.png" alt="" />
          <input type="text" name="map" id="map" placeholder="Şəhər , ölkə"
          />
          <button>Axtarış</button>
        </div>
        <div className="sponsor">
          {images.map((sponsor) => (
            <img key={sponsor.id} src={sponsor.image} alt={`sponsor-${sponsor.id}`} />
          ))}
        </div>
      </div>
      <div className="header-right">
        <img src="/image 104.png" alt="" />
      </div>
    </div>
  );
};

export default Header;
