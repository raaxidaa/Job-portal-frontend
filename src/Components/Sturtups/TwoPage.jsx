import React from 'react'
import images from './sponsorImages.json';

export const TwoPage = () => {
    return (
        <div className="Two">
            <div className="sponsor2">
                {images.map((sponsor) => (
                    <img key={sponsor.id} src={sponsor.image} alt={`sponsor-${sponsor.id}`} />
                ))}
            </div>
            <div className="center">
                <h4>Başlamaq 1, 2, 3 qədər asandır...</h4>
                <div className="numbers">
                    <div className="number">
                        <div className="top">
                            <span>01</span>
                            <img src="/Rating.png" alt="" />
                        </div>
                        <span>Start-up profilinizi yaradın</span>
                        <p>7 dəqiqədən az bir vaxtda, istedadları və potensial investorları cəlb etməyə kömək edəcək müasir bir profil əldə edəcəksiniz.</p>
                    </div>
                    <div className="number">
                        <div className="top">
                            <span>02</span>
                            <img src="/Button.png" alt="" />
                        </div>
                        <span>İş elanlarını pulsuz yerləşdirin</span>
                        <p>Yalnız sahibkarlıq və texnologiya istedadlarına çatın! 170,000+ namizəd və hər həftə minlərlə daha çoxu.</p>
                    </div>
                    <div className="number">
                        <div className="top">
                            <span>03</span>
                            <img src="/Rating1.png" alt="" />
                        </div>
                        <span>Ən uyğun namizədi işə götürün</span>
                        <p>Pulsuz müraciət idarəetmə sistemimizə imkan verin ki, qaranlıqda Ninja'yı tapın.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
