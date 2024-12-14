'use client'

import {useState, useRef, useEffect} from 'react'
import {Edit, Save, Building2, Upload, X} from 'lucide-react'
import {Button} from "@/Components/ui/button"
import {Input} from "@/Components/ui/input"
import {Textarea} from "@/Components/ui/textarea"
import {Card, CardContent, CardHeader, CardTitle} from "@/Components/ui/card"
import {Avatar, AvatarFallback, AvatarImage} from "@/Components/ui/avatar"
import {Label} from "@/Components/ui/label"
import {useToast} from "@/hooks/use-toast"
import Cookies from "js-cookie"
import axiosInstance from "@/lib/axiosInstance"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/Components/ui/select"
import {Switch} from "@/Components/ui/switch"
import {RadioGroup, RadioGroupItem} from "@/Components/ui/radio-group"

export default function CompanyDashboard() {
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [companyData, setCompanyData] = useState({
        id: 0,
        name: '',
        description: '',
        logo: '',
        industry: '',
        startupStage: '',
        openToRemote: false,
        funding: ''
    })
    const [industries, setIndustries] = useState([])
    const [previewLogo, setPreviewLogo] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const {toast} = useToast()

    useEffect(() => {
        const fetchData = async () => {
            await fetchIndustries(); // Fetch industries first
            await fetchCompanyData(); // Then fetch company data
        };
        fetchData();
    }, []);

    const fetchCompanyData = async () => {
        setIsLoading(true);
        const companyId = Cookies.get('company_id');
        try {
            const response = await axiosInstance.get(`/companies/${companyId}`);
            const data = response.data;

            // Map API response to state fields
            setCompanyData({
                id: data.id,
                name: data.name || '',
                description: data.description || '',
                logo: data.logo || '',
                industry: data.industryId?.toString() || '', // Convert to string for Select
                startupStage: data.startupStage || '',
                openToRemote: data.openToRemote === 'YES', // Convert "YES"/"NO" to boolean
                funding: data.funding || '',
            });

            // Handle logo preview
            setPreviewLogo(data.logo.startsWith('http') ? data.logo : `http://127.0.0.1:8000${data.logo}`);

            console.log('Selected Industry:', data.industry);
            console.log('Selected:', data.industryId);
            console.log('Available Industries:', industries);
        } catch (error) {
            console.error('Error fetching company data:', error);
            toast({
                title: "Xəta",
                description: "Şirkət məlumatları yüklənərkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchIndustries = async () => {
        try {
            const response = await axiosInstance.get('http://127.0.0.1:8000/api/industries')
            setIndustries(response.data)
        } catch (error) {
            console.error('Error fetching industries:', error)
            toast({
                title: "Xəta",
                description: "Sənaye sahələri yüklənərkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.",
                variant: "destructive",
            })
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target
        setCompanyData(prev => ({...prev, [name]: value}))
    }

    const handleSelectChange = (name: string, value: string) => {
        setCompanyData(prev => ({...prev, [name]: value}))
    }

    const handleSwitchChange = (checked: boolean) => {
        setCompanyData(prev => ({...prev, openToRemote: checked}))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            console.log('File selected:', file.name, file.type, file.size);
            setCompanyData(prev => ({...prev, logo: file}))
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewLogo(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const toggleEdit = () => {
        setIsEditing(!isEditing)
    }

    const handleSave = async () => {
        setIsLoading(true);
        const formData = new FormData();

        formData.append('name', companyData.name);
        formData.append('description', companyData.description || '');
        formData.append('industryId', Number(companyData.industry)); // Convert to number
        formData.append('startupStage', companyData.startupStage);
        formData.append('openToRemote', companyData.openToRemote ? 'YES' : 'NO');
        formData.append('funding', companyData.funding);

        if (companyData.logo instanceof File) {
            formData.append('logo', companyData.logo, companyData.logo.name);
        }

        try {
            const companyId = Cookies.get('company_id');
            await axiosInstance.post(`/companies/${companyId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Re-fetch company data to ensure it's up-to-date
            await fetchCompanyData();

            setIsEditing(false);

            toast({
                title: 'Uğurlu',
                description: 'Şirkət məlumatları müvəffəqiyyətlə yeniləndi.',
            });
        } catch (error) {
            console.error('Error updating company data:', error);
            toast({
                title: 'Xəta',
                description: 'Şirkət məlumatlarını yeniləyərkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false)
        fetchCompanyData() // Reset the data to the original state
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="max-w-4xl mx-auto shadow-lg">
                <CardHeader className="bg-primary text-primary-foreground p-6 rounded-t-xl">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-24 w-24 border-4 border-primary-foreground shadow-md">
                                <AvatarImage
                                    src={previewLogo || ''}
                                    alt={companyData.name}
                                />
                                <AvatarFallback className="bg-primary-foreground text-primary">
                                    <Building2 className="h-12 w-12"/>
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-3xl font-bold">Şirkət Profili</CardTitle>
                                <p className="text-sm opacity-90">Şirkət məlumatlarını idarə et</p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            {isEditing ? (
                                <>
                                    <Button onClick={handleSave}
                                            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                                            disabled={isLoading}>
                                        <Save className="mr-2 h-4 w-4"/>
                                        Dəyişiklikləri Saxla
                                    </Button>
                                    <Button onClick={handleCancel} variant="outline"
                                            className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground"
                                            disabled={isLoading}>
                                        <X className="mr-2 h-4 w-4"/>
                                        Ləğv Et
                                    </Button>
                                </>
                            ) : (
                                <Button onClick={toggleEdit}
                                        className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                                        disabled={isLoading}>
                                    <Edit className="mr-2 h-4 w-4"/>
                                    Profili Düzəlt
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    {isEditing && (
                        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                            <Label htmlFor="logo-upload" className="block text-sm font-medium text-gray-700 mb-2">
                                Şirkət Loqosu
                            </Label>
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-20 w-20 border-2 border-gray-300">
                                    <AvatarImage
                                        src={previewLogo || ''}
                                        alt={companyData.name}
                                    />
                                    <AvatarFallback>
                                        <Building2 className="h-10 w-10"/>
                                    </AvatarFallback>
                                </Avatar>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-white hover:bg-gray-100"
                                >
                                    <Upload className="mr-2 h-4 w-4"/>
                                    Yeni Loqo Yüklə
                                </Button>
                                <Input
                                    id="logo-upload"
                                    name="logo"
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    ref={fileInputRef}
                                />
                            </div>
                        </div>
                    )}

                    <div className="bg-white p-4 rounded-lg shadow">
                        <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Şirkət Adı
                        </Label>
                        {isEditing ? (
                            <Input
                                id="name"
                                name="name"
                                value={companyData.name}
                                onChange={handleInputChange}
                                className="w-full border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            />
                        ) : (
                            <p className="text-lg font-semibold text-gray-900 p-2 bg-gray-50 rounded">{companyData.name}</p>
                        )}
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Təsvir
                        </Label>
                        {isEditing ? (
                            <Textarea
                                id="description"
                                name="description"
                                value={companyData.description === "null" ? 'Hələ təsvir yoxdur' : companyData.description}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            />
                        ) : (
                            <p className="text-gray-700 p-2 bg-gray-50 rounded">{companyData.description === "null" ? 'Hələ təsvir yoxdur' : companyData.description}</p>
                        )}
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <Label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                            Sənaye Sahəsi
                        </Label>
                        {isEditing ? (
                            <Select
                                onValueChange={(value) => handleSelectChange('industry', value)}
                                value={companyData.industry} // Ensure this is a string
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Bir sənaye sahəsi seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    {industries.map((industry) => (
                                        <SelectItem key={industry.id} value={industry.id.toString()}>
                                            {industry.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <p className="text-lg font-semibold text-gray-900 p-2 bg-gray-50 rounded">
                                {industries.find(i => i.id.toString() === companyData.industry)?.name || 'Təyin edilməyib'}
                            </p>
                        )}
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <Label htmlFor="startupStage" className="block text-sm font-medium text-gray-700 mb-1">
                            Şirkət Səviyyəsi
                        </Label>
                        {isEditing ? (
                            <Select
                                onValueChange={(value) => handleSelectChange('startupStage', value)}
                                value={companyData.startupStage} // Ensure this is a string
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Şirkət səviyyəsini seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Go-to-market">Bazarın açılması</SelectItem>
                                    <SelectItem value="Seed">Toxum</SelectItem>
                                    <SelectItem value="Growth">Böyümə</SelectItem>
                                    <SelectItem value="Mature">Yetişmiş</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <p className="text-lg font-semibold text-gray-900 p-2 bg-gray-50 rounded">
                                {companyData.startupStage || 'Təyin edilməyib'}
                            </p>
                        )}
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="openToRemote" className="text-sm font-medium text-gray-700">
                                Uzaqdan işə açıqdır
                            </Label>
                            {isEditing ? (
                                <Switch
                                    id="openToRemote"
                                    checked={companyData.openToRemote}
                                    onCheckedChange={handleSwitchChange}
                                />
                            ) : (
                                <p className="text-lg font-semibold text-gray-900 p-2 bg-gray-50 rounded">
                                    {companyData.openToRemote ? 'Bəli' : 'Xeyr'}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <Label htmlFor="funding" className="block text-sm font-medium text-gray-700 mb-1">
                            Maliyyə Dəstəyi
                        </Label>
                        {isEditing ? (
                            <RadioGroup
                                onValueChange={(value) => handleSelectChange('funding', value)}
                                value={companyData.funding} // Ensure this matches the response value
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="not_looking" id="not_looking" />
                                    <Label htmlFor="not_looking">Hazırda maliyyə axtarılmır</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="looking" id="looking" />
                                    <Label htmlFor="looking">Maliyyə axtarılır</Label>
                                </div>
                            </RadioGroup>
                        ) : (
                            <p className="text-lg font-semibold text-gray-900 p-2 bg-gray-50 rounded">
                                {companyData.funding === 'looking' ? 'Maliyyə axtarılır' : 'Hazırda maliyyə axtarılmır'}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
