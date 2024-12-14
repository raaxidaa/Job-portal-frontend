import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Textarea } from "@/Components/ui/textarea"
import { Switch } from "@/Components/ui/switch"
import { Button } from "@/Components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { toast } from "@/hooks/use-toast"
import axiosInstance from "@/lib/axiosInstance"

interface Category {
    id: number;
    name: string;
}

export default function BlogCreatePage() {
    const navigate = useNavigate()
    const [blog, setBlog] = useState({
        title: '',
        content: '',
        isActive: 1,
        categoryId: '',
    })
    const [categories, setCategories] = useState<Category[]>([])
    const [isSaving, setIsSaving] = useState(false)
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/categories')
                setCategories(response.data)
            } catch (error) {
                console.error('Error fetching categories:', error)
                toast({
                    title: "Xəta",
                    description: "Kateqoriyalar yüklənmədi. Zəhmət olmasa yenidən cəhd edin.",
                    variant: "destructive",
                })
            }
        }

        fetchCategories()
    }, [])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSaving(true)
        try {
            const formData = new FormData()
            formData.append('title', blog.title)
            formData.append('content', blog.content)
            formData.append('category_id', blog.categoryId)
            formData.append('is_active', blog.isActive.toString())
            if (selectedImage) {
                formData.append('image', selectedImage)
            }

            const response = await axiosInstance.post('/blogs', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            if (!response.status) {
                throw new Error('Failed to create blog')
            }
            toast({
                title: "Uğur",
                description: "Bloq postu uğurla yaradıldı.",
            })
            navigate('/admin/blogs')
        } catch (err) {
            console.error('Error creating blog:', err)
            toast({
                title: "Xəta",
                description: "Bloq postu yaratmaq mümkün olmadı. Zəhmət olmasa yenidən cəhd edin.",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.target
        setBlog(prevBlog => ({...prevBlog, [name]: value}))
    }

    const handleCategoryChange = (value: string) => {
        setBlog(prevBlog => ({...prevBlog, categoryId: value}))
    }

    const handleSwitchChange = (checked: boolean) => {
        setBlog(prevBlog => ({...prevBlog, isActive: checked ? 1 : 0}))
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedImage(event.target.files[0])
        }
    }

    return (
        <div className="container mx-auto py-10">
            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Yeni Bloq Postu Yarat</CardTitle>
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
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category_id">Kateqoriya</Label>
                            <Select onValueChange={handleCategoryChange} value={blog.categoryId}>
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
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button type="button" variant="outline" onClick={() => navigate('/admin/blogs')}>
                            İmtina et
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? 'Yaradılır...' : 'Bloq Yarat'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
