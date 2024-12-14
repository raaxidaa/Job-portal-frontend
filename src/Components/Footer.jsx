import React from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const navigate = useNavigate();
  const handleSeeAllClick = () => {
    navigate('/seekfunding'); 
    scrollToTop();
  };

  return (
    <div className='footer'>
        <img src="/Vector 2.png" alt=""  className='absolute1'/>
        <img src="/Vector 3.png" alt="" className='absolute2'/>
        <img src="/Burst-pucker-2.png" alt="" className='absolute3' />
        <img src="/Burst-pucker-2.png" alt="" className='absolute4' />
        <h1>İş tapın <img src="/Burst-pucker-2.png" /> </h1>
        <p>Hoob, startapların istedad alışı və investorlara qoşulmalarına kömək edə biləcək platformadır.</p>
        <button onClick={handleSeeAllClick}>İşləri araşdırın</button>

        <div className="footer-boottom">
            <div className="footer-bottom-left">
                <span>© 2022 Hoob. Bütün hüquqlar qorunur</span>
                <div className="link">
                <Link to="/"  onClick={scrollToTop}>Ana səhifə</Link>
                <Link to="/privacy">Gizlilik</Link>
                <Link to="/terms">Şərtlər</Link>
                <Link to="/tools">Alətlər</Link>
                <Link to="/blog"  onClick={scrollToTop}>Blog</Link>
                <Link to="/partners">Tərəfdaşlar</Link>
                <Link to="/contact"  onClick={scrollToTop}>Əlaqə</Link>
                    
                </div>
            </div>
            <div className="footer-bottom-right">
                <Link to='/privacy-policy'>Gizlilik Siyasəti</Link>
                <Link to='/condition'>Şərtlər və Şərt</Link>
            </div>
        </div>
    </div>
  )
}

export default Footer;
