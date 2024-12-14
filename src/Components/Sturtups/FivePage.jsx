import React, { useState } from 'react';

const FivePage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'Bütün bunlar necə pulsuzdur?',
      answer: 'Bu xidmətlərin pulsuz olmasının səbəbi, Hub-un startup və investorları bir araya gətirmək məqsədini güdməsidir. Bu platforma, startup-ların və investorların əlaqə qurmasına kömək edir və eyni zamanda təcrübələri ilə fərqli faydalar təmin edir. Startup-ların özlərini tanıtma şansı və investorların daha yaxşı imkanları əldə etməsi məqsədilə bütün xidmətlər pulsuz təklif olunur.',
    },
    {
      question: 'Hub hamı üçün açıqdır?',
      answer: 'Bəli, Hub hər kəs üçün açıqdır. Həm startup-lar, həm də investorlar platformaya qoşula bilər və maraqlı olan şəxsləri tapa bilərlər. Bizim məqsədimiz, startup ekosistemini hər kəsə əlçatan etmək və yeni imkanlar yaratmaqdır. Qeydiyyatdan keçərək siz də Hub-un bir hissəsi ola bilərsiniz.',
    },
    {
      question: 'Startuplar nə axtarır?',
      answer: 'Startuplar əsasən güclü, yaradıcı və həvəsli komanda üzvləri, həmçinin investorlar axtarır. Onlar işlərini böyütmək və yeni perspektivlər açmaq üçün işçilər və maliyyə dəstəyi tələb edirlər. Hub-da, müxtəlif mərhələlərdə olan startup-lar öz sahələrində müvafiq məsləhətlər və partnyorlar tapmağa çalışırlar.',
    },
    {
      question: 'Startuplarla uyğunlaşdırma necə işləyir?',
      answer: 'Startup-ların və investorların uyğunlaşdırılması, müxtəlif faktorlar əsasında həyata keçirilir: sahə, mərhələ, maliyyələşmə miqdarı, yerləşdirmə və digər iş parametrləri. Bu uyğunlaşdırma prosesi, investorların və startup-ların daha səmərəli əlaqə qurmasına kömək edir və hər iki tərəf üçün faydalıdır.',
    },
    {
      question: 'Startuplar mənimlə necə əlaqə saxlaya bilər?',
      answer: 'Startuplar sizin profilinizi taparaq sizə birbaşa müraciət edə bilər. Hub, startup-ların öz ehtiyaclarına uyğun olaraq sizi tapmaq və əlaqə qurmaq üçün uyğun alətlər təqdim edir. Eyni zamanda siz startup-ların təqdim etdiyi açıq mövqeləri izləyərək onları daha yaxından tanıya bilərsiniz.',
    },
    {
      question: 'Startupları necə taparam?',
      answer: 'Startupları tapmaq üçün Hub platformasında müxtəlif filtrlərdən istifadə edə bilərsiniz. Ölkə, sənaye, maliyyələşmə mərhələsi və digər parametrlər əsasında startup-ları sıralayaraq maraqlı olanları seçə bilərsiniz. Həmçinin, bəyəndiyiniz startup-ları qeyd edib gələcəkdə daha rahat tapmaq mümkündür.',
    },
  ];

  return (
    <div className="Five">
      <h2>Tez-tez verilən suallar (FAQ)</h2>
      <div className="centers">
        {faqs.map((faq, index) => (
          <div key={index} className="q1">
            <div className="top" onClick={() => handleToggle(index)}>
              <h2>{faq.question}</h2>
              <img src="/arrow-chevron-down.png" alt="Toggle" className={activeIndex === index ? 'rotate' : ''} />
            </div>
            <p className={activeIndex === index ? 'visible' : 'hidden'}>{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FivePage;
