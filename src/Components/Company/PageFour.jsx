import React from 'react'
import images from './sponsorImages.json';

const PageFour = () => {
    return (
        <div className="PageFour">
            <div className="Pone">
                <h4>Bizim Partnyorlarımız</h4>
                <p>Hoob, inkişaf edən startup-lar üçün ən yaxşı həlləri təmin edən partnyorlarla əməkdaşlıq edir. Bu partnyorlar startup-ların böyüməsi və inkişafı üçün zəruri resurslar və dəstəklər təqdim edir.</p>
            </div>
            <div className="sponsor3">
                {images.map((sponsor) => (
                    <img key={sponsor.id} src={sponsor.image} alt={`sponsor-${sponsor.id}`} />
                ))}
            </div>
            <button>Gəlin Partnyor Olaq</button>
        </div>
    )
}

export default PageFour
