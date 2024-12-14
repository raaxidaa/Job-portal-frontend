import React from 'react'
import { useNavigate } from 'react-router-dom';

const ThreePage = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const navigate = useNavigate();

    const handleSeeAllClick = () => {
        navigate('/browsestartups');
        scrollToTop()
    };

    return (
        <div className="Three">
            <h2>Hansı faydaları əldə edirsiniz</h2>
            <img src="/Vector 1.png" alt="" />
            <div className="centers">
                <div className="center1">
                    <img src="/user.png" alt="" />
                    <span>Maximal görünürlük</span>
                    <p>Yalnız sizin regionunuzda maliyyə axtaran yüksək potensiala malik startup'lar tərəfindən görünür olun. Unicorn'lar, Zebra'lar və sabahın növləri sizə gəlsin!</p>
                </div>
                <div className="center2">
                    <img src="/bell.png" alt="" />
                    <span>Pulsuz tövsiyələr</span>
                    <p>Portfolio startup'larınızın sizə etibarlı investor olaraq sizi əlavə etməsi ilə sözlərini gerçəkləşdirmələrinə icazə verin</p>
                </div>
                <div className="center3">
                    <img src="/airplay1.png" alt="" />
                    <span>Pulsuz uyğunlaşdırma</span>
                    <p>Startup'lar sizinlə mərhələ, sahə, yer, biznes modeli və investisiya həcmi əsasında uyğunlaşdırılır</p>
                </div>
                <div className="center4">
                    <img src="/bell.png" alt="" />
                    <span>Startup brauzinqi</span>
                    <p>Hub, startup'ların inkişaf etdiyi yerdir! Özünüz baxın və gələcəkdə istifadə üçün bəyəndiklərinizi qeyd edin</p>
                </div>
            </div>
            <button onClick={handleSeeAllClick}>Startupları Gözdən Keçirin</button>
        </div>
    )
}

export default ThreePage;
