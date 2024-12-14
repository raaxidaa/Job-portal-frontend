import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import axiosInstance from "@/lib/axiosInstance.ts";
import axios from "axios";


const FindJobs = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [selectedJobType, setSelectedJobType] = useState('');
    const [minSalary, setMinSalary] = useState('');
    const [isRemote, setIsRemote] = useState('');
    const [maxSalary, setMaxSalary] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalJobs, setTotalJobs] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState(null);
    const [jobCounts, setJobCounts] = useState({});


    useEffect(() => {
        fetchJobs();
    }, [selectedRole, selectedLevel, selectedJobType, minSalary, maxSalary,
        searchQuery, locationQuery, currentPage, setIsRemote]);

    useEffect(() => {
        fetchCategories()
    }, []);

    const fetchCategories = async () => {
        const response = await axios(`http://127.0.0.1:8000/api/categories`, {
            method: 'GET',
        });

        if (!response.status === 200) {
            console.log('respons', response)
            throw new Error("Kateqoriyalar yüklənə bilmədi");
        }

        const data = await response.data

        setCategories(data);
    }

    useEffect(() => {
        const loadJobCounts = async () => {
            const counts = {};
            for (const category of categories) {
                console.log('cates', category)
                console.log('cates', category.id)
                counts[category.id] = await calculateJobCounts(category.id);
                console.log('count for category.id', category.id, counts);
            }

            setJobCounts(counts);
        };

        if (categories?.length) {
            loadJobCounts();
        }
    }, [categories]);

    const fetchJobs = async () => {
        setIsLoading(true);

        // Construct query parameters
        const params = new URLSearchParams({
            size: 10,
            page: currentPage,
            title: searchQuery,
            jobType: selectedJobType ? selectedJobType.replace(/\s+/g, '+') : '',
            seniorityLevel: selectedLevel,
            salaryMin: minSalary,
            salaryMax: maxSalary,
            isRemote: isRemote ? true : '',
            location: locationQuery,
            categoryId: selectedRole,
        });

        try {
            const response = await axios(`http://127.0.0.1:8000/api/vacancies/filter?${params.toString()}`, {
                method: 'GET',
            });

            if (!response.status === 200) {
                console.log('respons', response)
                throw new Error("İşlər yüklənə bilmədi");
            }

            const data = await response.data

            setFilteredJobs(data.data || []);
            setTotalJobs(data.total || 0);
        } catch (error) {
            console.error(error);
            setFilteredJobs([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchJobs();
    };

    const handleRoleFilter = (keyword) => {
        setSelectedRole(keyword);
    };

    const handleLevelFilter = (level) => {
        setSelectedLevel(level);
    };

    const handleJobTypeFilter = (jobType) => {
        setSelectedJobType(jobType);
    };

    const handleClearFilters = () => {
        setSelectedRole('');
        setSelectedLevel('');
        setSearchQuery('');
        setLocationQuery('');
        setSelectedJobType('');
        setMinSalary('');
        setMaxSalary('');
        setIsRemote(false)
        setCurrentPage(1);
        fetchJobs();
    };

    const handleSalaryChange = (e) => {
        const {id, value} = e.target;
        if (id === 'minSalary') {
            setMinSalary(value);
        } else if (id === 'maxSalary') {
            setMaxSalary(value);
        }
    };

    const keywords = [
        "Analitik",
        "Developer",
        "İnkişaf",
        "Elmi",
        "Dizayn",
        "Mühəndis",
        "Marketinq"
    ];

    const jobTypes = {
        'full-time': 'Tam zamanlı',
        'contract': 'Müqavilə',
        'part-time': 'Yarım zamanlı'
    };

    const calculateJobCounts = async (categoryId) => {

        const response = await axios(`http://127.0.0.1:8000/api/vacancies/filter?categoryId=${categoryId}`, {
            method: 'GET',
        });

        if (!response.status === 200) {
            console.log('respons', response)
            throw new Error("İşlər yüklənə bilmədi");
        }

        const data = await response.data

        return data?.total;
    };

    // const jobCounts = calculateJobCounts();

    const handleRemoteFilter = (remote) => {
        console.log('handleRemoteFilter', remote);
        setIsRemote(remote);
    };

    function formatTimeAgo(createdAt) {
        const createdDate = new Date(createdAt);
        const now = new Date();

        const timeDiff = now - createdDate; // Difference in milliseconds
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        if (daysDiff === 0) {
            return "Bugün";
        } else if (daysDiff < 30) {
            return `${daysDiff} gün əvvəl`;
        } else {
            const monthsDiff = Math.floor(daysDiff / 30);
            return `${monthsDiff} ay əvvəl`;
        }
    }


    return (
        <div className="back">
            <div className='find-jobs container'>
                <div className="search2">
                    <img src="/search.png" alt=""/>
                    <input type="text" name="search" id="search" placeholder="Şirkət, İş Başlığı..." value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}/>
                    <img src="/map-pin-3.png" alt=""/>
                    <input type="text" name="map" id="map" placeholder="Şəhər, Ştat, və ya Ölkə" value={locationQuery}
                           onChange={(e) => setLocationQuery(e.target.value)}/>
                    <button onClick={handleSearch}>Axtar</button>
                </div>
                <div className="find-jobs-center">
                    <div className="center-left">
                        <div className="title">
                            <h1>İş İmkanları <span>({totalJobs})</span></h1>
                        </div>
                        <div className="jobs">
                            {isLoading ? (
                                <p></p>
                            ) : filteredJobs.length > 0 ? (
                                filteredJobs.map(job => (
                                    <Link to={`/job/${job.id}`} key={job.id}>
                                        <div className="job">
                                            <div className="job-top">
                                                <div className="job-top-left">
                                                    <img src={`http://127.0.0.1:8000${job.logo}`}
                                                         alt={`${job.companyName} logo`}/>
                                                </div>
                                                <div className="job-top-right">
                                                    <div className='bir'>
                                                        <span>{job.companyName}</span>
                                                        <span>{formatTimeAgo(job.createdAt)}</span>
                                                    </div>
                                                    <div className='iki'>
                                                        <h1>{job.title}</h1>
                                                        <span>FAST APPLY</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="job-bottom">
                                                <div className="date">
                                                    <img src="/map-pin-3.png" alt=""/>
                                                    <span>{job.city + ', ' + job.country}</span>
                                                </div>
                                                <div className="date">
                                                    <img src="/calendar.png" alt=""/>
                                                    <span>{jobTypes[job.jobType]}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className='error1'>Daxil edilmiş meyarlara uyğun iş tapılmadı.</p>
                            )}
                        </div>
                    </div>
                    <div className="center-right">
                        <div className="center-right-title">
                            <span>Filtrlər</span>
                            <span className='clear' onClick={handleClearFilters}> Təmizlə</span>
                        </div>
                        <div className="filters">
                            <div className="filter1">
                                <div className="title">
                                    <span className='hidden1'>Rollar</span>
                                    <img src="/arrow-chevron-up.png" alt=""/>
                                </div>
                                {categories?.map((category, index) => (
                                    <div className="five uno1" key={index}>
                                        <input type="radio" name="roles" id={category.id}
                                               onChange={() => handleRoleFilter(category.id)}
                                               checked={selectedRole === category.id}/>
                                        <label htmlFor={category.id}>{category.name}
                                            <span>({jobCounts[category?.id] || 0})</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <div className="filter2">
                                <div className="title">
                                    <span>Seniority Səviyyəsi</span>
                                    <img src="/arrow-chevron-up.png" alt=""/>
                                </div>
                                <div className="five">
                                    <input type="radio" name="level" id="junior"
                                           onChange={() => handleLevelFilter("junior")}
                                           checked={selectedLevel === "junior"}/>
                                    <label htmlFor="junior">Junior</label>
                                </div>
                                <div className="five">
                                    <input type="radio" name="level" id="mid-level"
                                           onChange={() => handleLevelFilter("mid-level")}
                                           checked={selectedLevel === "mid-level"}/>
                                    <label htmlFor="mid-level">Orta Səviyyə</label>
                                </div>
                                <div className="five">
                                    <input type="radio" name="level" id="senior"
                                           onChange={() => handleLevelFilter("senior")}
                                           checked={selectedLevel === "senior"}/>
                                    <label htmlFor="senior">Senior</label>
                                </div>
                                <div className="five">
                                    <input type="radio" name="level" id="lead"
                                           onChange={() => handleLevelFilter("lead")}
                                           checked={selectedLevel === "lead"}/>
                                    <label htmlFor="lead">Ekspert & Liderlik</label>
                                </div>
                            </div>
                            <div className="filter3">
                                <div className="title">
                                    <span>İş Növü</span>
                                    <img src="/arrow-chevron-up.png" alt=""/>
                                </div>
                                <div className="five">
                                    <input type="radio" name="jobType" id="full-time"
                                           onChange={() => handleJobTypeFilter("full-time")}
                                           checked={selectedJobType === "full-time"}/>
                                    <label htmlFor="full-time">Tam zamanlı</label>
                                </div>
                                <div className="five">
                                    <input type="radio" name="jobType" id="contract"
                                           onChange={() => handleJobTypeFilter("contract")}
                                           checked={selectedJobType === "contract"}/>
                                    <label htmlFor="contract">Müqavilə/ Freelancer</label>
                                </div>
                                <div className="five">
                                    <input type="radio" name="jobType" id="intern"
                                           onChange={() => handleJobTypeFilter("intern")}
                                           checked={selectedJobType === "intern"}/>
                                    <label htmlFor="intern">Təcrübəçi</label>
                                </div>
                                <div className="five">
                                    <input type="radio" name="jobType" id="part-time"
                                           onChange={() => handleJobTypeFilter("part-time")}
                                           checked={selectedJobType === "part-time"}/>
                                    <label htmlFor="part-time">Yarım zamanlı</label>
                                </div>
                            </div>
                            <div className="filter4">
                                <div className="title">
                                    <span>Uzaqdan İşləməyə Açıq</span>
                                    <img src="/arrow-chevron-up.png" alt=""/>
                                </div>
                                <div className="five">
                                    <input type="radio" name="remote" id="remote"
                                           onChange={() => handleRemoteFilter(!isRemote)}/>
                                    <label htmlFor="remote">Uzaqdan İşləməyə Açıq</label>
                                </div>
                            </div>
                            <div className="filter5">
                                <div className="title">
                                    <span>Maaş</span>
                                    <img src="/arrow-chevron-up.png" alt=""/>
                                </div>
                                <div className="five">
                                    <select id="minSalary" onChange={handleSalaryChange}>
                                        <option value="">$ Min</option>
                                        <option value="3000">3000</option>
                                        <option value="5000">5000</option>
                                        <option value="10000">10000</option>
                                        <option value="20000">20000</option>
                                        <option value="200000">200000</option>
                                    </select>
                                    <select id="maxSalary" onChange={handleSalaryChange}>
                                        <option value="">$ Max</option>
                                        <option value="3000">3000</option>
                                        <option value="5000">5000</option>
                                        <option value="10000">10000</option>
                                        <option value="20000">20000</option>
                                        <option value="200000">200000</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FindJobs;
