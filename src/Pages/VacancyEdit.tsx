'use client'

import {useEffect, useState} from 'react'
import {ArrowLeft, MinusCircle, PlusCircle} from 'lucide-react'
import {Button} from "@/Components/ui/button"
import {Input} from "@/Components/ui/input"
import {Textarea} from "@/Components/ui/textarea"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/Components/ui/select"
import {Switch} from "@/Components/ui/switch"
import {Label} from "@/Components/ui/label"
import {Card, CardContent, CardHeader, CardTitle} from "@/Components/ui/card"
import {Link, useNavigate, useParams} from 'react-router-dom'
import {useToast} from "@/hooks/use-toast";
import {Toaster} from "@/Components/ui/toaster"
import axiosInstance from "@/lib/axiosInstance";


const countryMapping: Record<string, string> = {
    US: 'Birləşmiş Ştatlar',
    AZ: 'Azərbaycan',
    UK: 'Birləşmiş Krallıq',
    CA: 'Kanada',
    AU: 'Avstraliya',
    DE: 'Almaniya',
    FR: 'Fransa',
    ES: 'İspaniya',
    IT: 'İtaliya',
    BR: 'Braziliya',
    IN: 'Hindistan',
    JP: 'Yaponiya',
    CN: 'Çin',
    RU: 'Rusiya',
    MX: 'Meksika',
    ZA: 'Cənubi Afrika',
    AR: 'Argentina',
    NG: 'Nigeriya',
    AE: 'Birləşmiş Ərəb Əmirlikləri',
    TR: 'Türkiyə',
    SA: 'Səudiyyə Ərəbistanı',
    NL: 'Niderlandlar',
    SE: 'İsveç',
    CH: 'İsveçrə',
    BE: 'Belçika',
    AT: 'Avstriya',
    DK: 'Danimarka',
    FI: 'Finlandiya',
    NO: 'Norveç',
    PL: 'Polşa',
    PT: 'Portuqaliya',
    GR: 'Yunanıstan',
    IE: 'İrlandiya',
    SG: 'Sinqapur',
    MY: 'Malayziya',
    TH: 'Tayland',
    PH: 'Filippinlər',
    ID: 'İndoneziya',
    NZ: 'Yeni Zelandiya',
    KR: 'Cənubi Koreya',
};

type Vacancy = {
    id: number;
    title: string;
    categoryId: string;
    isRemote: boolean;
    isActive: boolean;
    jobType: string;
    seniorityLevel: string;
    city: string;
    state: string;
    country: string;
    description: string;
    countryCode: string;
    salary: number;
    jobOverview: string;
    jobRole: string;
    jobResponsibilities: string[];
    youHaveText: string[];
};

export default function VacancyEdit() {
    const {vacancyId} = useParams();
    const navigate = useNavigate();
    const [vacancy, setVacancy] = useState<Vacancy | null>(null);
    const {toast} = useToast()


    useEffect(() => {
        if (!vacancyId) {
            console.warn('vacancyId is missing.');
            return;
        }

        const fetchVacancy = async () => {
            try {
                const response = await axiosInstance.get<Vacancy>(`http://127.0.0.1:8000/api/companies/vacancies/${vacancyId}`);
                setVacancy(response.data);
            } catch (error) {
                toast({
                    title: "Xəta",
                    description: "Vakansiya məlumatlarını əldə etmək mümkün olmadı. Zəhmət olmasa yenidən cəhd edin.",
                    variant: "destructive",
                });
            }
        };

        fetchVacancy();
    }, [vacancyId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setVacancy((prev) => prev ? { ...prev, [name]: value } : prev);
    };

    const handleSelectChange = (name: string, value: string) => {
        setVacancy((prev) => {
            if (!prev) return prev;

            if (name === 'country' || name === 'countryCode') {
                return {
                    ...prev,
                    country: countryMapping[value],
                    countryCode: value,
                };
            }

            return {
                ...prev,
                [name]: value,
            };
        });
    };

    const handleSwitchChange = (name: string, checked: boolean) => {
        setVacancy((prev) => {
            if (!prev) return prev;
            return {...prev, [name]: checked};
        });
    };

    const handleArrayChange = (index: number, value: string, field: 'jobResponsibilities' | 'youHaveText') => {
        setVacancy((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                [field]: prev[field].map((item, i) => (i === index ? value : item)),
            };
        });
    };

    const addArrayItem = (field: 'jobResponsibilities' | 'youHaveText') => {
        setVacancy((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                [field]: [...prev[field], ''],
            };
        });
    };

    const removeArrayItem = (index: number, field: 'jobResponsibilities' | 'youHaveText') => {
        setVacancy((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                [field]: prev[field].filter((_, i) => i !== index),
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!vacancy || !vacancyId) {
            toast({
                title: "Xəta",
                description: "Yanlış vakansiya məlumatı. Zəhmət olmasa yenidən cəhd edin.",
                variant: "destructive",
            })
            return
        }

        try {
            const updatedData = {
                title: vacancy.title,
                categoryId: vacancy.categoryId,
                isRemote: vacancy.isRemote,
                isActive: vacancy.isActive,
                jobType: vacancy.jobType,
                seniorityLevel: vacancy.seniorityLevel,
                city: vacancy.city,
                description: vacancy.description,
                state: vacancy.state,
                country: vacancy.country,
                countryCode: vacancy.countryCode,
                salary: vacancy.salary,
                jobOverview: vacancy.jobOverview,
                jobRole: vacancy.jobRole,
                jobResponsibilities: vacancy.jobResponsibilities,
                youHaveText: vacancy.youHaveText,
            };

            const response = await axiosInstance.put(
                `http://127.0.0.1:8000/api/vacancies/${vacancyId}`, JSON.stringify(updatedData)
            );

            if (response.status === 200) {
                toast({
                    title: "Uğur",
                    description: "Vakansiya uğurla yeniləndi.",
                })
                navigate(`/company/vacancies/${vacancyId}`)
            }
        } catch (error) {
            console.error('Vakansiya yenilənmədi:', error);
            toast({
                title: "Xəta",
                description: "Vakansiya yenilənə bilmədi. Zəhmət olmasa yenidən cəhd edin.",
                variant: "destructive",
            })
        }
    };

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get('http://127.0.0.1:8000/api/categories');
            if (response.status === 200) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error('Kateqoriyalar əldə oluna bilmədi:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
                <Link to={`/company/vacancies`}>
                    <Button variant="ghost" className="p-0 hover:bg-transparent">
                        <ArrowLeft className="h-6 w-6 mr-2"/>
                        <span>Vakansiyaya Qayıt</span>
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Vakansiyanı Redaktə Et</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Vakansiya Məlumatları</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Başlıq</Label>
                                <Input id="title" name="title" value={vacancy?.title} onChange={handleInputChange}
                                       required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="categoryId">Kateqoriya</Label>
                                <Select name="categoryId" value={vacancy?.categoryId}
                                        onValueChange={(value) => handleSelectChange('categoryId', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Bir kateqoriya seçin"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories?.map((category) => {
                                            return (<SelectItem  key={category.id} value={category.id.toString()}>{category.name}</SelectItem>)
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="jobType">İş Növü</Label>
                                <Select name="jobType" value={vacancy?.jobType}
                                        onValueChange={(value) => handleSelectChange('jobType', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="İş növünü seçin"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="full-time">Tam iş</SelectItem>
                                        <SelectItem value="part-time">Yarım iş</SelectItem>
                                        <SelectItem value="contract">Müqavilə</SelectItem>
                                        <SelectItem value="internship">Təcrübə</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="seniorityLevel">Təcrübə Səviyyəsi</Label>
                                <Select name="seniorityLevel" value={vacancy?.seniorityLevel}
                                        onValueChange={(value) => handleSelectChange('seniorityLevel', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Təcrübə səviyyəsini seçin"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="intern">Təcrübəçi</SelectItem>
                                        <SelectItem value="junior">Junior</SelectItem>
                                        <SelectItem value="middle">Middle</SelectItem>
                                        <SelectItem value="senior">Senior</SelectItem>
                                        <SelectItem value="lead">Lead</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="salary">Maaş</Label>
                                <Input id="salary" name="salary" type="number" value={vacancy?.salary}
                                       onChange={handleInputChange}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Ölkə</Label>
                                <Select
                                    name="country"
                                    value={vacancy?.countryCode}
                                    onValueChange={(value) => handleSelectChange('countryCode', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Ölkə seçin"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(countryMapping).map(([code, name]) => (
                                            <SelectItem key={code} value={code}>{name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state">Ölkə</Label>
                                <Input id="state" name="state" value={vacancy?.state} onChange={handleInputChange}
                                       required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">Şəhər</Label>
                                <Input id="city" name="city" value={vacancy?.city} onChange={handleInputChange}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Təsvir</Label>
                                <Textarea id="description" name="description" value={vacancy?.description}
                                          onChange={handleInputChange}/>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="jobOverview">İş Ümumi Baxış</Label>
                            <Textarea id="jobOverview" name="jobOverview" value={vacancy?.jobOverview}
                                      onChange={handleInputChange} required/>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="jobRole">İş Rollu</Label>
                            <Textarea id="jobRole" name="jobRole" value={vacancy?.jobRole} onChange={handleInputChange}
                                      required/>
                        </div>

                        <div className="space-y-2">
                            <Label>İş Vəzifələri</Label>
                            {vacancy?.jobResponsibilities.map((responsibility, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <Input
                                        value={responsibility}
                                        onChange={(e) => handleArrayChange(index, e.target.value, 'jobResponsibilities')}
                                        required
                                    />
                                    <Button type="button" variant="ghost" size="icon"
                                            onClick={() => removeArrayItem(index, 'jobResponsibilities')}>
                                        <MinusCircle className="h-4 w-4"/>
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={() => addArrayItem('jobResponsibilities')}>
                                <PlusCircle className="h-4 w-4 mr-2"/> Vəzifə əlavə et
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label>Sizə Lazım Olanlar</Label>
                            {vacancy?.youHaveText.map((item, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <Input
                                        value={item}
                                        onChange={(e) => handleArrayChange(index, e.target.value, 'youHaveText')}
                                        required
                                    />
                                    <Button type="button" variant="ghost" size="icon"
                                            onClick={() => removeArrayItem(index, 'youHaveText')}>
                                        <MinusCircle className="h-4 w-4"/>
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={() => addArrayItem('youHaveText')}>
                                <PlusCircle className="h-4 w-4 mr-2"/> "Sizə Lazım Olan" əlavə et
                            </Button>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="isRemote"
                                checked={vacancy?.isRemote}
                                onCheckedChange={(checked) => handleSwitchChange('isRemote', checked)}
                            />
                            <Label htmlFor="isRemote">Uzaqdan İş</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="isActive"
                                checked={vacancy?.isActive}
                                onCheckedChange={(checked) => handleSwitchChange('isActive', checked)}
                            />
                            <Label htmlFor="isActive">Vakansiyanı Aktiv Et</Label>
                        </div>

                        <Button type="submit">Yadda Saxla</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
