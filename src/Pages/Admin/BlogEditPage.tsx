import React, {useState, useEffect, useRef} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {format} from 'date-fns'
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/Components/ui/card"
import {Input} from "@/Components/ui/input"
import {Label} from "@/Components/ui/label"
import {Textarea} from "@/Components/ui/textarea"
import {Switch} from "@/Components/ui/switch"
import {Button} from "@/Components/ui/button"
import {Skeleton} from "@/Components/ui/skeleton"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/Components/ui/select"
import {toast} from "@/hooks/use-toast"
import axiosInstance from "@/lib/axiosInstance"
import {Trash2} from 'lucide-react'

interface Blog {
    id: number
    title: string
    content: string
    isActive: number
    imageUrl: string
    categoryId: number
    categories_name: string
    createdAt: string
    updatedAt: string
}

interface Category {
    id: number;
    name: string;
}

export default function BlogEditPage() {
    const {id} = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [blog, setBlog] = useState<Blog | null>(null)
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const [blogResponse, categoriesResponse] = await Promise.all([ 
                    axiosInstance.get(`/blogs/${id}`), 
                    axiosInstance.get('/categories') 
                ])
                setBlog(blogResponse.data)
                setCategories(categoriesResponse.data)
                setIsLoading(false)
            } catch (err) {
                console.error('Məlumat yüklənərkən xəta:', err)
                toast({
                    title: "Xəta",
                    description: "Məlumat yüklənmədi. Zəhmət olmasa yenidən cəhd edin.",
                    variant: "destructive",
                })
                setIsLoading(false)
            }
        }

        fetchData()
    }, [id])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSaving(true)
        try {
            const formData = new FormData()
            if (blog) {
                formData.append('id', blog.id.toString())
                formData.append('title', blog.title)
                formData.append('content', blog.content)
                formData.append('category_id', blog.categoryId.toString())
                formData.append('is_active', blog.isActive.toString())
                if (selectedImage) {
                    formData.append('image', selectedImage)
                }
            }

            const response = await axiosInstance.post(`/blogs/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            if (!response.status) {
                throw new Error('Bloq postu yenilənərkən xəta baş verdi')
            }
            toast({
                title: "Uğur",
                description: "Bloq postu uğurla yeniləndi.",
            })
            navigate('/admin/blogs')
        } catch (err) {
            console.error('Bloq yenilənərkən xəta:', err)
            toast({
                title: "Xəta",
                description: "Bloq postunu yeniləmək mümkün olmadı. Zəhmət olmasa yenidən cəhd edin.",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.target
        setBlog(prevBlog => prevBlog ? {...prevBlog, [name]: value} : null)
    }

    const handleCategoryChange = (value: string) => {
        setBlog(prevBlog => prevBlog ? {...prevBlog, categoryId: parseInt(value)} : null)
    }

    const handleSwitchChange = (checked: boolean) => {
        setBlog(prevBlog => prevBlog ? {...prevBlog, isActive: checked ? 1 : 0} : null)
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedImage(event.target.files[0])
        }
    }

    const handleDelete = async () => {
        try {
            await axiosInstance.delete(`/blogs/${id}`)
            toast({
                title: "Uğur",
                description: "Bloq postu uğurla silindi.",
            })
            navigate('/admin/blogs')
        } catch (err) {
            console.error('Bloq silinərkən xəta:', err)
            toast({
                title: "Xəta",
                description: "Bloq postunu silmək mümkün olmadı. Zəhmət olmasa yenidən cəhd edin.",
                variant: "destructive",
            })
        }
    }

    if (isLoading) {
        return (
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-[200px]"/>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full"/>
                        <Skeleton className="h-4 w-full"/>
                        <Skeleton className="h-20 w-full"/>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!blog) {
        return (
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Xəta</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Bloq postu yüklənə bilmədi. Zəhmət olmasa yenidən cəhd edin.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10">
            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Bloq Postunu Redaktə Et</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Başlıq</Label>
                            <Input
                                id="title"
                                name="title"
                                value={blog.title}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content">Məzmun</Label>
                            <Textarea
                                id="content"
                                name="content"
                                value={blog.content}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="is_active"
                                checked={blog.isActive === 1}
                                onCheckedChange={handleSwitchChange}
                            />
                            <Label htmlFor="is_active">Aktiv</Label>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image">Şəkil</Label>
                            <Input
                                id="image"
                                name="image"
                                type="file"
                                onChange={handleImageChange}
                                accept="image/jpeg,image/png,image/gif"
                                ref={fileInputRef}
                            />
                            {blog.imageUrl && (
                                <div className="mt-2">
                                    <p>Cari şəkil:</p>
                                    <img src={blog.imageUrl} alt="Cari bloq şəkli" className="max-w-xs mt-2"/>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category_id">Kateqoriya</Label>
                            <Select onValueChange={handleCategoryChange} value={blog.categoryId.toString()}>
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
                            <Label>Yaradılma Tarixi</Label>
                            <p>{format(new Date(blog.createdAt), 'PPP')}</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Yenilənmə Tarixi</Label>
                            <p>{format(new Date(blog.updatedAt), 'PPP')}</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <div>
                            <Button type="button" variant="outline" onClick={() => navigate('/admin/blogs')}>
                                İmtina et
                            </Button>
                            <Button type="button" variant="destructive" onClick={handleDelete} className="ml-2">
                                <Trash2 className="h-4 w-4 mr-2"/>
                                Sil
                            </Button>
                        </div>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? 'Yenilənir...' : 'Dəyişiklikləri Saxla'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
