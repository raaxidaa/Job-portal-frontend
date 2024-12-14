import React from 'react'

export const BlogTop = () => {
  return (
   <div className="BlogTop container">
    <div className="left">
        <img src="/Imageb.png" alt="" />
    </div>
    <div className="right">
        <span>MOZAİK</span> {/* "TOPIC" -> "MOZAİK" */}
        <h4>Diskriminasiyasız İşə Qəbul – Edilməsi və Edilməməsi Lazım Olanlar</h4> {/* "Hiring Without Discriminating – Do's and Don’ts" */}
        <p>Bir iş müraciətçisi sizinlə potensial bir iş elanına müraciət etməyə başladığı andan etibarən, o, İsveç Diskriminasiya Qanunu və Avropa İttifaqının İş və Peşəkar Tədbirlərdə Bərabər Davranış Direktivi ilə qorunur. Bir işəgötürən olaraq, siz bunun fərqində olmalı və diskriminasiya səbəbləri üzündən birinin müsahibəyə və ya işə qəbuluna mane olmamalısınız.</p> {/* Açıklama metni */}
        <div className="data">
            <img src="/Vertical container.png" alt="" />
            <span>Leslie Alexander</span>
            <span>8 Aprel, 2022 tarixində</span> {/* "on April 8, 2022" -> "8 Aprel, 2022 tarixində" */}
        </div>
    </div>
   </div>
  )
}
