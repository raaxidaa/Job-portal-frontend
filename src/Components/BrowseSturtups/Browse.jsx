import React, {useState, useEffect} from 'react';
import CompaniesData from './Companies.json';
import axios from "axios";

const Browse = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [filteredJobs, setFilteredJobs] = useState(CompaniesData);
    const [openToRemote, setOpenToRemote] = useState();
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [selectedJobType, setSelectedJobType] = useState('');
    const [selectedFunding, setSelectedFunding] = useState('');
    const [industries, setIndustries] = useState([]);

    useEffect(() => {
        companies();
    }, [searchQuery, locationQuery, selectedRole, selectedLevel, selectedJobType, selectedFunding]);

    useEffect(() => {
        fetchIndustries()
    }, []);

    const fetchIndustries = async () => {
        try {
            const industriesResponse = await axios.get(`http://127.0.0.1:8000/api/industries`);
            if (industriesResponse.status === 200) {
                const industriesData = industriesResponse.data;

                const industriesWithCounts = await Promise.all(
                    industriesData.map(async (industry) => {
                        try {
                            const countResponse = await axios.get(`http://127.0.0.1:8000/api/industries/${industry.id}/companies`);
                            return {
                                ...industry,
                                companyCount: countResponse.data.total,
                            };
                        } catch (error) {
                            console.error(`Error fetching count for industry ${industry.id}:`, error);
                            return {
                                ...industry,
                                companyCount: 0,
                            };
                        }
                    })
                );

                setIndustries(industriesWithCounts);
            }
        } catch (error) {
            console.error('Error fetching industries:', error);
        }
    };

    const companies = async () => {
        const params = {
            name: searchQuery, 
            vacancyName: searchQuery, 
            vacancyCity: locationQuery, 
            vacancyCountry: locationQuery, 
            industryId: selectedRole,
            startupStage: selectedLevel,
            startupSize: selectedJobType,
            openToRemote: openToRemote,
            sortBy: 'desc', 
        };

        try {
            const response = await axios.get('http://127.0.0.1:8000/api/companies', {params});

            if (response.status === 200) {
                setFilteredJobs(response.data);
            } else {
                console.error("Failed to fetch companies");
            }
        } catch (error) {
            console.error("Error fetching companies:", error);
        }
    };

    const handleSearch = () => {
        companies();
    };

    const handleOpenToRemote = (value) => {
        setOpenToRemote(value);
    }

    const keywords = [
        "Reklam",
        "Kənd Təsərrüfatı",
        "Blockchain",
        "İstehlak Malları",
        "Təhsil",
        "Enerji və Greentech",
        "Fintech",
        "Qida və İçecek",
        "Səhiyyə"
    ];

    const calculateJobCounts = () => {
        const jobCounts = {};
        keywords.forEach(keyword => {
            jobCounts[keyword] = 0;
        });
        CompaniesData.forEach(job => {
            const title = job.jobTitle.toLowerCase();
            keywords.forEach(keyword => {
                if (title.includes(keyword.toLowerCase())) {
                    jobCounts[keyword]++;
                }
            });
        });

        return jobCounts;
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

    const handleRemoteFilter = () => {
        setFilteredJobs(prevJobs =>
            prevJobs.filter(job => job.remoteStatus === "Remote OK")
        );
    };

    const handleClearFilters = () => {
        setSelectedRole('');
        setSelectedLevel('');
        setSearchQuery('');
        setLocationQuery('');
        setSelectedJobType('');
        setSelectedFunding('');
        setFilteredJobs(CompaniesData);
    };

    return (
        <div className="back">
            <div className='find-jobs container'>
                <div className="search2">
                    <img src="/search.png" alt=""/>
                    <input type="text" id="search" name="search" placeholder="Şirkət, İş başlığı..." value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}/>
                    <img src="/map-pin-3.png" alt=""/>
                    <input type="text" id="map" name="map" placeholder="Şəhər, Ştat və ya Ölkə" value={locationQuery}
                           onChange={(e) => setLocationQuery(e.target.value)}/>
                    <button onClick={handleSearch}>Axtar</button>
                </div>
                <div className="find-jobs-center">
                    <div className="center-left">
                        <div className="title">
                            <h1>Şirkətlər <span>({filteredJobs.length})</span></h1>
                            <button className='newest'>
                                <img src="/flashlight.png" alt=""/>
                                Ən yeni
                                <img src="/arrow-chevron-down.png" alt=""/>
                            </button>
                        </div>
                        {filteredJobs.length === 0 ? (
                            <p className='error1'>Daxil edilən meyarlara uyğun şirkət tapılmadı.</p>
                        ) : (
                            <div className="companies1">
                                {filteredJobs.map(job => (
                                    <div className="comp1" key={job.id}>
                                        <div className="top">
                                            <img src={`http://127.0.0.1:8000${job.logo}`} alt={job.name}
                                                 className={"w-14 h-14 object-cover"}/>
                                            <span>{job.name}</span>
                                        </div>
                                        <div className="center">
                                            <span>{job.description}</span>
                                        </div>
                                        <div className="bottom">
                                            <button>{job.jobCount} İş Mövqeyi Mövcuddur</button>
                                            <img src="/arrow-right-up.png" alt=""/>
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
                                    <span className='hidden1'>Sənaye</span>
                                    <img src="/arrow-chevron-up.png" alt=""/>
                                </div>
                                {industries.map((industry) => (
                                    <div className="five uno1" key={industry.id}>
                                        <input
                                            type="radio"
                                            id={industry.id}
                                            name="roles"
                                            onChange={() => handleRoleFilter(industry.id)}
                                            checked={selectedRole === industry.id}
                                        />
                                        <label htmlFor={industry.name}>
                                            {industry.name} <span>({industry.companyCount})</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <div className="filter2">
                                <div className="title">
                                    <span>Başlanğıc Səviyyəsi</span>
                                    <img src="/arrow-chevron-up.png" alt=""/>
                                </div>
                                <div className="five">
                                    <input type="radio" id="Idea" name="StartupStage"
                                           onChange={() => handleLevelFilter("Idea")}
                                           checked={selectedLevel === "Idea"}/>
                                    <label htmlFor="Idea">İdea</label>
                                </div>
                                <div className="five">
                                    <input type="radio" id="Product-or-prototype" name="StartupStage"
                                           onChange={() => handleLevelFilter("Product-or-prototype")}
                                           checked={selectedLevel === "Product-or-prototype"}/>
                                    <label htmlFor="Product-or-prototype">Məhsul və ya Prototip</label>
                                </div>
                                <div className="five">
                                    <input type="radio" id="Go-to-market" name="StartupStage"
                                           onChange={() => handleLevelFilter("Go-to-market")}
                                           checked={selectedLevel === "Go-to-market"}/>
                                    <label htmlFor="Go-to-market">Bazarə çıxma</label>
                                </div>
                                <div className="five">
                                    <input type="radio" id="Growth-and-expansion" name="StartupStage"
                                           onChange={() => handleLevelFilter("Growth-and-expansion")}
                                           checked={selectedLevel === "Growth-and-expansion"}/>
                                    <label htmlFor="Growth-and-expansion">Böyümə və genişlənmə</label>
                                </div>
                            </div>
                            <div className="filter3">
                                <div className="title">
                                    <span>Başlanğıc Ölçüsü</span>
                                    <img src="/arrow-chevron-up.png" alt=""/>
                                </div>
                                <div className="five">
                                    <input type="radio" id="on" name="StartupSize"
                                           onChange={() => handleJobTypeFilter("1-10")}
                                           checked={selectedJobType === "1-10"}/>
                                    <label htmlFor="on">1-10</label>
                                </div>
                                <div className="five">
                                    <input type="radio" id="elli" name="StartupSize"
                                           onChange={() => handleJobTypeFilter("51-100")}
                                           checked={selectedJobType === "51-100"}/>
                                    <label htmlFor="elli">51-100</label>
                                </div>
                                <div className="five">
                                    <input type="radio" id="yuz" name="StartupSize"
                                           onChange={() => handleJobTypeFilter("101-200")}
                                           checked={selectedJobType === "101-200"}/>
                                    <label htmlFor="yuz">101-200</label>
                                </div>
                                <div className="five">
                                    <input type="radio" id="ikiyuz" name="StartupSize"
                                           onChange={() => handleJobTypeFilter("200+")}
                                           checked={selectedJobType === "200+"}/>
                                    <label htmlFor="ikiyuz">200+</label>
                                </div>
                            </div>
                            <div className="filter4">
                                <div className="title">
                                    <span>Uzaqdan işləməyə açıq</span>
                                    <img src="/arrow-chevron-up.png" alt=""/>
                                </div>
                                <div className="five">
                                    <input type="radio" id="remote" name="remote" onChange={handleOpenToRemote}/>
                                    <label htmlFor="remote">Uzaqdan işləməyə açıq</label>
                                </div>
                            </div>
                            <div className="filter5">
                                <div className="title">
                                    <span>Yatırım</span>
                                    <img src="/arrow-chevron-up.png" alt=""/>
                                </div>
                                <div className="five">
                                    <input type="radio" id="Currently" name="funding"
                                           onChange={() => setSelectedFunding('Currently not looking for funding')}
                                           checked={selectedFunding === 'Currently not looking for funding'}/>
                                    <label htmlFor="Currently">Hal-hazırda yatırım axtarmırıq</label>
                                </div>
                                <div className="five">
                                    <input type="radio" id="Looking for funding" name="funding"
                                           onChange={() => setSelectedFunding('Looking for funding')}
                                           checked={selectedFunding === 'Looking for funding'}/>
                                    <label htmlFor="Looking for funding">Yatırım axtarırıq</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Browse;
