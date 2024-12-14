import React from 'react'

const Contact = () => {
  return (
   <div className="contact container">
    <div className="top">
        <div className="left">
            <h1>Bir ideyanız varmı?</h1>
            <h1>Gəlin danışaq.</h1>
            <p>Bizə buradan bir qeyd buraxın və ya <span>(312) 448-7405</span> nömrəsi ilə bizə zəng edin.</p>
        </div>
        <div className="right">
            <img src="/public/Vector 22.png" alt="" />
            <img src="/public/Burst-pucker-2.png" alt="" />
        </div>
    </div>
    <div className="bottom">
        <div className="bottom-top">
            <div className="left">
                <label htmlFor="name">Ad</label>
                <input type="text" name="" id="name"  placeholder='Adınız'/>
            </div>
            <div className="right">
                <label htmlFor="lastname">Soyad</label>
                <input type="text" name="" id="lastname"  placeholder='Soyadınız'/>
            </div>
        </div>
        <div className="two">
            <label htmlFor="email">E-poçt</label>
            <input type="text" name="" id="email"  placeholder='E-poçt ünvanınız'/>
        </div>
        <div className="two">
            <label htmlFor="idea">Bizə ideyanız haqqında danışın</label>
            <textarea name="" id="idea">Qeyd...</textarea>
        </div>
        <div className="button">
            <button>Göndər</button>
        </div>
    </div>

   </div>
  )
}

export default Contact
