'use client'

import {useEffect, useState} from 'react'
import {Button} from "@/Components/ui/button"
import {Input} from "@/Components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/Components/ui/select"
import {Switch} from "@/Components/ui/switch"
import {Label} from "@/Components/ui/label"
import {ArrowLeft, MinusCircle, PlusCircle} from 'lucide-react'
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import {Textarea} from "@/Components/ui/textarea";
import axiosInstance from "@/lib/axiosInstance";

export default function AddVacancy() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        categoryId: '',
        isRemote: false,
        isActive: true,
        jobType: '',
        seniorityLevel: '',
        salary: '',
        jobOverview: [''],
        city: '',
        country: '',
        description: '',
        countryCode: '',
        state: '',
        jobRole: [''],
        jobResponsibilities: [''],
        youHaveText: [''],
        requirements: ['']
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target
        setFormData(prev => ({...prev, [name]: value}))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => {
            if (!prev) return prev;

            // Check if the field being changed is "country" or "countryCode"
            if (name === 'country' || name === 'countryCode') {
                // Update both "country" and "countryCode" together
                return {
                    ...prev,
                    country: countryMapping[value],
                    countryCode: value,
                };
            }

            // For other fields, update normally
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    const handleSwitchChange = (name: string, checked: boolean) => {
        setFormData(prev => ({...prev, [name]: checked}))
    }

    const handleArrayChange = (index: number, value: string, field: 'jobResponsibilities' | 'youHaveText' | 'requirements' | 'jobRole' | 'jobOverview') => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }))
    }

    const addArrayItem = (field: 'jobResponsibilities' | 'youHaveText' | 'requirements' | 'jobRole' | 'jobOverview') => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }))
    }

    const removeArrayItem = (index: number, field: 'jobResponsibilities' | 'youHaveText' | 'requirements' | 'jobRole' | 'jobOverview') => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }))
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const payload = {
                categoryId: formData.categoryId,
                title: formData.title,
                isRemote: formData.isRemote,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                countryCode: formData.country,
                jobType: formData.jobType,
                description: formData.description,
                seniorityLevel: formData.seniorityLevel,
                salary: formData.salary ? parseFloat(formData.salary) : null,
                jobOverview: formData.jobOverview,
                jobRole: formData.jobRole,
                jobResponsibilities: formData.jobResponsibilities.filter((item) => item.trim() !== ''),
                youHaveText: formData.youHaveText.filter((item) => item.trim() !== ''),
                requirements: formData.requirements.filter((item) => item.trim() !== ''),
                isActive: formData.isActive,
            };

            // Make the POST request to the API
            const response = await axiosInstance.post('http://127.0.0.1:8000/api/vacancies', payload);

            // Check the response status
            if (response.status === 201) {
                console.log('Vacancy created successfully:', response.data);
                // Redirect to the vacancies list after successful submission
                navigate('/company/vacancies');
            } else {
                console.error('Failed to create vacancy:', response.data);
            }
        } catch (error) {
            console.error('Error while creating vacancy:', error);
        }
    };

    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

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
            console.error('Failed to fetch categories:', error);
        }
    };

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
        NL: 'Niderland',
        SE: 'İsveç',
        CH: 'İsveçrə',
        BE: 'Belçika',
        AT: 'Avstriya',
        DK: 'Danimarka',
        FI: 'Fins',
        NO: 'Norveç',
        PL: 'Polyeniya',
        PT: 'Portuqaliya',
        GR: 'Yunanıstan',
        IE: 'İrlandiya',
        SG: 'Sinqapur',
        MY: 'Malayziya',
        TH: 'Tayland',
        PH: 'Filippin',
        ID: 'İndoneziya',
        NZ: 'Yeni Zelandiya',
        KR: 'Cənubi Koreya',
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6 flex items-center space-x-5">
                <Link to="/company/vacancies">
                    <Button variant="outline" className="px-3">
                        <ArrowLeft className="h-6 w-6"/>
                        <span className="sr-only">Vakansiyalara qayıt</span>
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Yeni Vakansiya Əlavə Et</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Başlıq</Label>
                        <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="categoryId">Kateqoriya</Label>
                        <Select name="categoryId" onValueChange={(value) => handleSelectChange('categoryId', value)}
                                required>
                            <SelectTrigger>
                                <SelectValue placeholder="Kateqoriya seçin"/>
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="jobType">İş Növü</Label>
                        <Select name="jobType" onValueChange={(value) => handleSelectChange('jobType', value)} required>
                            <SelectTrigger>
                                <SelectValue placeholder="İş növü seçin"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="full-time">Tam zamanlı</SelectItem>
                                <SelectItem value="part-time">Yarım zamanlı</SelectItem>
                                <SelectItem value="contract">Müqavilə</SelectItem>
                                <SelectItem value="internship">Təcrübə</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="seniorityLevel">Vəzifə Səviyyəsi</Label>
                        <Select name="seniorityLevel"
                                onValueChange={(value) => handleSelectChange('seniorityLevel', value)} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Vəzifə səviyyəsini seçin"/>
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
                        <Label htmlFor="salary">Əməkhaqqı (İstəyə bağlı)</Label>
                        <Input id="salary" name="salary" type="number" value={formData.salary}
                               onChange={handleInputChange}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="country">Ölkə</Label>
                        <Select
                            name="country"
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
                        <Label htmlFor="state">Ştat</Label>
                        <Input id="state" name="state" value={formData.state} onChange={handleInputChange} required/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="city">Şəhər (İstəyə bağlı)</Label>
                        <Input id="city" name="city" value={formData.city} onChange={handleInputChange}/>
                    </div>
                    <div className="space-y-2 w-full">
                        <Label htmlFor="description">Təsvir</Label>
                        <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required/>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>İşin Ümumi Baxışı</Label>
                    {formData.jobOverview.map((overview, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <Input
                                value={overview}
                                onChange={(e) => handleArrayChange(index, e.target.value, 'jobOverview')}
                                required
                            />
                            <Button type="button" variant="ghost" size="icon"
                                    onClick={() => removeArrayItem(index, 'jobOverview')}>
                                <MinusCircle className="h-4 w-4"/>
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => addArrayItem('jobOverview')}>
                        <PlusCircle className="h-4 w-4 mr-2"/> Yeni Vəzifə Əlavə Et
                    </Button>
                </div>

                <div className="space-y-2">
                    <Label>İş Vəzifəsi</Label>
                    {formData.jobRole.map((role, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <Input
                                value={role}
                                onChange={(e) => handleArrayChange(index, e.target.value, 'jobRole')}
                                required
                            />
                            <Button type="button" variant="ghost" size="icon"
                                    onClick={() => removeArrayItem(index, 'jobRole')}>
                                <MinusCircle className="h-4 w-4"/>
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => addArrayItem('jobRole')}>
                        <PlusCircle className="h-4 w-4 mr-2"/> Yeni Vəzifə Əlavə Et
                    </Button>
                </div>

                <div className="space-y-2">
                    <Label>İş Məsuliyyətləri</Label>
                    {formData.jobResponsibilities.map((responsibility, index) => (
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
                        <PlusCircle className="h-4 w-4 mr-2"/> Yeni Məsuliyyət Əlavə Et
                    </Button>
                </div>

                <div className="space-y-2">
                    <Label>Sizə Lazım Olanlar</Label>
                    {formData.youHaveText.map((item, index) => (
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
                        <PlusCircle className="h-4 w-4 mr-2"/> Yeni Tələblər Əlavə Et
                    </Button>
                </div>


                <div className="flex items-center space-x-2">
                    <Switch
                        id="isRemote"
                        checked={formData.isRemote}
                        onCheckedChange={(checked) => handleSwitchChange('isRemote', checked)}
                    />
                    <Label htmlFor="isRemote">Uzaqdan İş</Label>
                </div>

                <div className="flex items-center space-x-2">
                    <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => handleSwitchChange('isActive', checked)}
                    />
                    <Label htmlFor="isActive">Aktiv Vakansiya</Label>
                </div>

                <Button type="submit" className="w-full">Vakansiyanı Yarat</Button>
            </form>
        </div>
    );
}
