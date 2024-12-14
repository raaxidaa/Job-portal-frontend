'use client'

import {useEffect, useState} from 'react'
import {ArrowLeft} from 'lucide-react'
import {Button} from "@/Components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/Components/ui/card"
import {Badge} from "@/Components/ui/badge"
import {Link, useNavigate, useParams} from "react-router-dom";
import Cookies from "js-cookie";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/Components/ui/dialog";
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

export default function VacancyView() {
    const {vacancyId} = useParams();
    const navigate = useNavigate();
    const [vacancy, setVacancy] = useState<Vacancy | null>(null);
    const [categoryName, setCategoryName] = useState<string>('');
    const [isDeleting, setIsDeleting] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const jobTypeLabels: Record<string, string> = {
        'full-time': 'Tam zamanlı',
        'part-time': 'Yarım zamanlı',
        'contract': 'Müqavilə',
    };

    const seniorityLevelLabels: Record<string, string> = {
        'junior': 'Junior',
        'middle': 'Orta',
        'senior': 'Senior',
        'intern': 'Təcrübəçi',
    };

    useEffect(() => {
        const fetchVacancy = async () => {
            const token = Cookies.get('access_token');

            try {
                const vacancyResponse = await axiosInstance.get<Vacancy>(`/companies/vacancies/${vacancyId}`);
                const vacancyData = vacancyResponse.data;
                setVacancy(vacancyData);

                if (vacancyData.categoryId) {
                    const categoryResponse = await axiosInstance.get<Category>(`/categories/${vacancyData.categoryId}`);
                    setCategoryName(categoryResponse.data.name);
                }
            } catch (error) {
                console.error('İş elanı və ya kateqoriya məlumatlarını çəkmək mümkün olmadı:', error);
            }
        };

        fetchVacancy();
    }, [vacancyId]);

    const handleDelete = async () => {
        const ids = [vacancy?.id];

        try {
            await axiosInstance.delete('/vacancies', {data: {ids}});
            navigate('/company/vacancies');
        } catch (error) {
            console.error('İş elanını silmək mümkün olmadı:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
                <Link to="/company/vacancies">
                    <Button variant="ghost" className="p-0 hover:bg-transparent">
                        <ArrowLeft className="h-6 w-6 mr-2"/>
                        <span>İş elanlarına qayıt</span>
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">İş Elanı Təfərrüatları</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>{vacancy?.title}</span>
                        <Badge variant={vacancy?.isActive ? "default" : "secondary"}>
                            {vacancy?.isActive ? "Aktiv" : "Deaktiv"}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold">İş Elanı ID</h3>
                            <p>{vacancy?.id}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Kateqoriya</h3>
                            <p>{categoryName || 'Yüklənir...'}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">İş Növü</h3>
                            <p>{jobTypeLabels[vacancy?.jobType ?? ''] || vacancy?.jobType}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Vəzifə Səviyyəsi</h3>
                            <p>{seniorityLevelLabels[vacancy?.seniorityLevel ?? ''] || vacancy?.seniorityLevel}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Yer</h3>
                            <p>{`${vacancy?.city}, ${vacancy?.state}, ${vacancy?.country}`}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Uzaqdan İcra</h3>
                            <p>{vacancy?.isRemote ? 'Bəli' : 'Xeyr'}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Əmək Haqqı</h3>
                            <p>{vacancy?.salary ? `$${vacancy?.salary.toLocaleString()}` : 'Təqdim edilməyib'}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Təsvir</h3>
                            <p>{vacancy?.description ? `${vacancy?.description}` : 'Təqdim edilməyib'}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">İşin Ümumi Görünüşü</h3>
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
                        <h3 className="text-lg font-semibold">İş Rolları</h3>
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
                        <h3 className="text-lg font-semibold">Sənə Ait</h3>
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
                                <h3 className="font-semibold">Son Dəyişiklik Tarixi</h3>
                                <p>{new Date(vacancy?.updatedAt ?? '').toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-6 flex justify-end space-x-4">
                <Button variant="outline" onClick={() => navigate(`/company/vacancies/edit/${vacancy?.id}`)}>
                    İş Elanını Redaktə Et
                </Button>
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="destructive">İş Elanını Sil</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Bu iş elanını silmək istəyirsiniz?</DialogTitle>
                            <DialogDescription>
                                Bu əməliyyat geri alına bilməz. Bu, iş elanını qalıcı olaraq siləcək və məlumatları serverlərimizdən siləcək.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                İmtina Et
                            </Button>
                            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                                {isDeleting ? 'Silinir...' : 'İş Elanını Sil'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <Toaster/>
        </div>
    )
}
