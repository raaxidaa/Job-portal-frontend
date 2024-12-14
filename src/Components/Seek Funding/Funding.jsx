import React, { useState, useEffect } from 'react';
import InvestorData from './investor.json';
import { useNavigate } from 'react-router-dom';
const Funding = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    const navigate = useNavigate();
    const handleSeeAllClick = () => {
      navigate('/investor'); 
      scrollToTop()
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [filteredJobs, setFilteredJobs] = useState(InvestorData);
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [selectedJobType, setSelectedJobType] = useState('');

    useEffect(() => {
        applyFilters(InvestorData);
    }, [selectedRole, selectedLevel, selectedJobType, searchQuery, locationQuery]);

    const keywords = [
        "Reklam",
        "Kənd Təsərrüfatı",
        "Blokçeyn",
        "İstehlak Malları",
        "Təhsil",
        "Enerji və Yaşıl Texnologiyalar",
        "Fintex",
        "Qida və İçecek",
        "Səhiyyə"
    ];

    const keywords2 = [
        "Akkelerator / Inkubator",
        "Mələklər Qrupu",
        "Mələklər İnvestoru",
        "Bank Kreditləri",
        "Kütləvi Maliyyələşdirmə",
        "Ailə Ofisi",
        "Şəxsi Fonlar",
        "İctimai Maliyyələşdirmə",
        "Tədqiqat Maliyyələşdirməsi",
        "VC"
    ];

    const calculateJobCounts = () => {
        const jobCounts = {};
        keywords.forEach(keyword => {
            jobCounts[keyword] = 0;
        });
        keywords2.forEach(keyword => {
            jobCounts[keyword] = 0;
        });

        InvestorData.forEach(job => {
            const title = job.jobTitle ? job.jobTitle.toLowerCase() : '';
            const funding = job.funding ? job.funding.toLowerCase() : '';
            keywords.forEach(keyword => {
                if (title.includes(keyword.toLowerCase())) {
                    jobCounts[keyword]++;
                }
            });
            keywords2.forEach(keyword => {
                if (funding === keyword.toLowerCase()) {
                    jobCounts[keyword]++;
                }
            });
        });

        return jobCounts;
    };

    const jobCounts = calculateJobCounts();

    const handleRoleFilter = (keyword) => {
        setSelectedRole(keyword);
    };

    const handleLevelFilter = (level) => {
        setSelectedLevel(level);
    };

    const handleJobTypeFilter = (funding) => {
        setSelectedJobType(funding);
    };

    const handleClearFilters = () => {
        setSelectedRole('');
        setSelectedLevel('');
        setSearchQuery('');
        setLocationQuery('');
        setSelectedJobType('');
        setFilteredJobs(InvestorData);
    };

    const applyFilters = (data) => {
        let filteredData = data;

        if (selectedRole) {
            filteredData = filteredData.filter(job =>
                job.jobTitle.toLowerCase().includes(selectedRole.toLowerCase())
            );
        }

        if (selectedLevel) {
            filteredData = filteredData.filter(job =>
                job.jobType.toLowerCase().includes(selectedLevel.toLowerCase())
            );
        }

        if (selectedJobType) {
            filteredData = filteredData.filter(job =>
                job.funding.toLowerCase() === selectedJobType.toLowerCase()
            );
        }

        if (searchQuery) {
            filteredData = filteredData.filter(job =>
                job.companyName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (locationQuery) {
            filteredData = filteredData.filter(job =>
                job.location.toLowerCase().includes(locationQuery.toLowerCase())
            );
        }

        setFilteredJobs(filteredData);
    };

    return (
        <div className="back">
            <div className='find-jobs container'>
                <div className="tops">
                    <div className="left">
                        <span>FONDLAMA AXTARIN</span>
                        <h4>Öndə gedən investorlarla əlaqə qurun</h4>
                        <p>Hansının sizin üçün uyğun olduğunu bilmirsiniz? İnvestor uyğunlaşdırma alətimizi istifadə edin və növbəti addımınızı atın.</p>
                        <button onClick={handleSeeAllClick}>İnvestor tapın</button>
                        <span>⚡ Tamamlanması ~2 dəqiqə çəkir️</span>
                    </div>
                    <div className="right">
                        <img src="/Illustration.png" alt="Illustration" />
                        <img src="/Vector 33.png" alt="Vector" />
                    </div>
                </div>
                <div className="find-jobs-center">
                    <div className="center-left">
                        <div className="title">
                            <h1>Son İnvestorlar <span>({filteredJobs.length})</span></h1>
                            <button className='newest'>
                                <img src="/flashlight.png" alt="Flashlight" />
                                Ən Yeni
                                <img src="/arrow-chevron-down.png" alt="Arrow" />
                            </button>
                        </div>
                        {filteredJobs.length === 0 ? (
                            <p className='error1'>Daxil edilən meyarlara uyğun investor tapılmadı.</p>
                        ) : (
                            <div className="companies1">
                                {filteredJobs.map(job => (
                                    <div className="comp2" key={job.id}>
                                        <div className="imgt">
                                            <img src={`/${job.images}`} alt={job.companyName} />
                                        </div>
                                        <h6>{job.companyName}</h6>
                                        <p>{job.description}</p>
                                        <div className="end">
                                            <span>{job.funding}</span>
                                            <img src="/arrow-right-up.png" alt="Arrow" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="center-right">
                        <div className="center-right-title">
                            <span>Filtrlər</span>
                            <span className='clear' onClick={handleClearFilters}> Təmizlə</span>
                        </div>
                        <div className="filters">
                            <div className="filter1">
                                <div className="title">
                                    <span>Açar söz</span>
                                    <img src="/arrow-chevron-up.png" alt="Arrow" />
                                </div>
                                <div className="five">
                                    <input 
                                        type="search" 
                                        name="search" 
                                        id="search" 
                                        className='sl' 
                                        placeholder='Şirkət, iş başlığı...' 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="filter1">
                                <div className="title">
                                    <span>Yerləşmə</span>
                                    <img src="/arrow-chevron-up.png" alt="Arrow" />
                                </div>
                                <div className="five">
                                    <input 
                                        type="text" 
                                        name="location" 
                                        id="location" 
                                        className='sl' 
                                        placeholder='Şəhər, Dövlət və ya Ölkə' 
                                        value={locationQuery}
                                        onChange={(e) => setLocationQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="filter3">
                                <div className="title">
                                    <span>İnvestor Tipi</span>
                                    <img src="/arrow-chevron-up.png" alt="Arrow" />
                                </div>
                                {keywords2.map((keyword, index) => (
                                    <div className="five uno1" key={index}>
                                        <input 
                                            type="radio" 
                                            id={keyword} 
                                            name="roles" 
                                            onChange={() => handleJobTypeFilter(keyword)} 
                                            checked={selectedJobType === keyword} 
                                        />
                                        <label htmlFor={keyword}>
                                            {keyword} <span>({jobCounts[keyword] || 0})</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <div className="filter2">
                                <div className="title">
                                    <span>Investisiya Səviyyəsi</span>
                                    <img src="/arrow-chevron-up.png" alt="Arrow" />
                                </div>
                                <div className="five">
                                    <input 
                                        type="radio" 
                                        id="Idea" 
                                        name="StartupStage" 
                                        onChange={() => handleLevelFilter("Idea")} 
                                        checked={selectedLevel === "Idea"} 
                                    />
                                    <label htmlFor="Idea">Fikir</label>
                                </div>
                                <div className="five">
                                    <input 
                                        type="radio" 
                                        id="Product-or-prototype" 
                                        name="StartupStage" 
                                        onChange={() => handleLevelFilter("Product-or-prototype")} 
                                        checked={selectedLevel === "Product-or-prototype"} 
                                    />
                                    <label htmlFor="Product-or-prototype">Məhsul və ya prototip</label>
                                </div>
                                <div className="five">
                                    <input 
                                        type="radio" 
                                        id="Go-to-market" 
                                        name="StartupStage" 
                                        onChange={() => handleLevelFilter("Go-to-market")} 
                                        checked={selectedLevel === "Go-to-market"} 
                                    />
                                    <label htmlFor="Go-to-market">Bazarə çıxış</label>
                                </div>
                                <div className="five">
                                    <input 
                                        type="radio" 
                                        id="Growth-and-expansion" 
                                        name="StartupStage" 
                                        onChange={() => handleLevelFilter("Growth-and-expansion")} 
                                        checked={selectedLevel === "Growth-and-expansion"} 
                                    />
                                    <label htmlFor="Growth-and-expansion">Böyümə və genişlənmə</label>
                                </div>
                            </div>
                            <div className="filter1">
                                <div className="title">
                                    <span className='hidden1'>Sahə</span>
                                    <img src="/arrow-chevron-up.png" alt="Arrow" />
                                </div>
                                {keywords.map((keyword, index) => (
                                    <div className="five uno1" key={index}>
                                        <input 
                                            type="radio" 
                                            id={keyword} 
                                            name="roles" 
                                            onChange={() => handleRoleFilter(keyword)} 
                                            checked={selectedRole === keyword} 
                                        />
                                        <label htmlFor={keyword}>
                                            {keyword} <span>({jobCounts[keyword] || 0})</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Funding;
