'use client'

import {useEffect, useState} from 'react'
import {ArrowLeft} from 'lucide-react'
import {Button} from "@/Components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/Components/ui/card"
import {Badge} from "@/Components/ui/badge"
import {Link, useNavigate, useParams} from "react-router-dom";
import {Toaster} from "@/Components/ui/toaster";
import axiosInstance from "@/lib/axiosInstance";

type Vacancy = {
    id: number;
    companyId: number;
    categoryId: number;
    isRemote: boolean;
    salary: number;
    title: string;
    description: string;
    jobType: string;
    seniorityLevel: string;
    city: string;
    country: string;
    state: string;
    jobOverview: string[];
    jobRole: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    jobResponsibilities: string[];
    youHaveText: string[];
};

type Category = {
    id: number;
    name: string;
};

// This would typically come from your API
// const mockVacancy = {
//     id: 'VAC001',
//     title: 'Senior Software Engineer',
//     categoryName: 'Engineering',
//     isRemote: true,
//     isActive: true,
//     jobType: 'Full-time',
//     seniorityLevel: 'Senior',
//     city: 'San Francisco',
//     state: 'California',
//     country: 'United States',
//     salary: 150000,
//     jobOverview: 'We are seeking a talented Senior Software Engineer to join our dynamic team...',
//     jobRole: 'As a Senior Software Engineer, you will be responsible for designing and implementing...',
//     jobResponsibilities: [
//         'Lead the development of complex software systems',
//         'Mentor junior developers and provide technical guidance',
//         'Collaborate with cross-functional teams to define and implement innovative solutions',
//     ],
//     youHaveText: [
//         '5+ years of experience in software development',
//         'Strong proficiency in JavaScript, TypeScript, and React',
//         'Experience with cloud technologies (AWS, Azure, or GCP)',
//     ],
//     createdAt: '2023-06-01T00:00:00Z',
//     updatedAt: '2023-06-15T00:00:00Z',
// }


export default function VacancyViewAdmin() {
    const {vacancyId} = useParams();
    const navigate = useNavigate();
    const [vacancy, setVacancy] = useState<Vacancy | null>(null);
    const [categoryName, setCategoryName] = useState<string>('');

    const jobTypeLabels: Record<string, string> = {
        'full-time': 'Tam iş',
        'part-time': 'Hissə vaxtlı',
        'contract': 'Müqavilə',
    };

    const seniorityLevelLabels: Record<string, string> = {
        'junior': 'Junior',
        'middle': 'Middle',
        'senior': 'Senior',
        'intern': 'Təcrübəçi',
    };

    useEffect(() => {
        const fetchVacancy = async () => {

            try {
                // Fetch the vacancy details
                const vacancyResponse = await axiosInstance.get<Vacancy>(`/admin/vacancies/${vacancyId}`);

                const vacancyData = vacancyResponse.data;
                setVacancy(vacancyData);

                // Fetch the category details using categoryId
                if (vacancyData.categoryId) {
                    const categoryResponse = await axiosInstance.get<Category>(`/categories/${vacancyData.categoryId}`);
                    setCategoryName(categoryResponse.data.name);
                }
            } catch (error) {
                console.error('Vakansiya və ya kateqoriya məlumatlarını çəkmək mümkün olmadı:', error);
            }
        };

        // Fetch data when the component mounts or vacancyId changes
        fetchVacancy();
    }, [vacancyId]);


    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
                <Link to="/admin/vacancies">
                    <Button variant="ghost" className="p-0 hover:bg-transparent">
                        <ArrowLeft className="h-6 w-6 mr-2"/>
                        <span>Vakansiyalara qayıt</span>
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Vakansiya Ətraflı</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>{vacancy?.title}</span>
                        <Badge variant={vacancy?.isActive ? "default" : "secondary"}>
                            {vacancy?.isActive ? "Aktiv" : "Passiv"}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold">Vakansiya ID</h3>
                            <p>{vacancy?.id}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Kateqoriya</h3>
                            <p>{categoryName || 'Yüklənir...'}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">İş növü</h3>
                            <p>{jobTypeLabels[vacancy?.jobType ?? ''] || vacancy?.jobType}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Səviyyə</h3>
                            <p>{seniorityLevelLabels[vacancy?.seniorityLevel ?? ''] || vacancy?.seniorityLevel}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Yer</h3>
                            <p>{`${vacancy?.city}, ${vacancy?.state}, ${vacancy?.country}`}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Uzaqdan işləmə</h3>
                            <p>{vacancy?.isRemote ? 'Bəli' : 'Xeyr'}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Maaş</h3>
                            <p>{vacancy?.salary ? `$${vacancy?.salary.toLocaleString()}` : 'Təyin edilməyib'}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Təsvir</h3>
                            <p>{vacancy?.description ? `${vacancy?.description}` : 'Təyin edilməyib'}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">İş Ümumi Baxış</h3>
                        <ul className="space-y-2">
                            {vacancy?.jobOverview.map((overview, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="mr-2 mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"/>
                                    <span>{overview}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">İş Rolü</h3>
                        <ul className="space-y-2">
                            {vacancy?.jobRole.map((role, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="mr-2 mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"/>
                                    <span>{role}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">İş Məsuliyyətləri</h3>
                        <ul className="space-y-2">
                            {vacancy?.jobResponsibilities.map((responsibility, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="mr-2 mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"/>
                                    <span>{responsibility}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Sizdə Olan</h3>
                        <ul className="space-y-2">
                            {vacancy?.youHaveText.map((item, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="mr-2 mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"/>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold">Yaradılma Tarixi</h3>
                            <p>{new Date(vacancy?.createdAt ?? '').toLocaleString()}</p>
                            <div>
                                <h3 className="font-semibold">Son Yenilənmə Tarixi</h3>
                                <p>{new Date(vacancy?.updatedAt ?? '').toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-6 flex justify-end space-x-4">
                <Button variant="outline" onClick={() => navigate(`/admin/vacancies/${vacancy?.id}/edit`)}>
                    Vakansiyanı Redaktə Et
                </Button>
            </div>
            <Toaster/>
        </div>
    )
}
