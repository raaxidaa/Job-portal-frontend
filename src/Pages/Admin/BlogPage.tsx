import React, {useState, useEffect} from 'react'
import {format} from 'date-fns'
import {Edit, Plus} from 'lucide-react'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/Components/ui/table"
import {Button} from "@/Components/ui/button"
import {Skeleton} from "@/Components/ui/skeleton"
import {useNavigate} from "react-router-dom";
import axiosInstance from "@/lib/axiosInstance";

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

function BlogTableSkeleton() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Şəkil</TableHead>
                    <TableHead>Başlıq</TableHead>
                    <TableHead>Kateqoriya</TableHead>
                    <TableHead>Aktiv</TableHead>
                    <TableHead>Yaradılma Tarixi</TableHead>
                    <TableHead>Əməliyyatlar</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-12 w-12 rounded-md"/></TableCell>
                        <TableCell><Skeleton className="h-4 w-[250px]"/></TableCell>
                        <TableCell><Skeleton className="h-4 w-[100px]"/></TableCell>
                        <TableCell><Skeleton className="h-4 w-[50px]"/></TableCell>
                        <TableCell><Skeleton className="h-4 w-[100px]"/></TableCell>
                        <TableCell><Skeleton className="h-8 w-[100px]"/></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

function BlogTable({blogs}: { blogs: Blog[] }) {
    const navigate = useNavigate()

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Şəkil</TableHead>
                    <TableHead>Başlıq</TableHead>
                    <TableHead>Kateqoriya</TableHead>
                    <TableHead>Aktiv</TableHead>
                    <TableHead>Yaradılma Tarixi</TableHead>
                    <TableHead>Əməliyyatlar</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {blogs.map((blog) => (
                    <TableRow key={blog.id}>
                        <TableCell>
                            <img
                                src={blog.imageUrl}
                                alt={blog.title}
                                width={50}
                                height={50}
                                className="rounded-md"
                            />
                        </TableCell>
                        <TableCell>{blog.title}</TableCell>
                        <TableCell>{blog.categories_name}</TableCell>
                        <TableCell>{blog.isActive ? 'Bəli' : 'Xeyr'}</TableCell>
                        <TableCell>{format(new Date(blog.createdAt), 'PPP')}</TableCell>
                        <TableCell>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    // Edit funksiyasını burada tətbiq et
                                    navigate(`/admin/blogs/edit/${blog.id}`)
                                }}
                            >
                                <Edit className="h-4 w-4 mr-2"/>
                                Düzəliş et
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default function BlogPage() {
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchBlogs() {
            try {
                const response = await axiosInstance.get('http://127.0.0.1:8000/api/blogs')
                if (!response.status) {
                    throw new Error('Bloqların alınması uğursuz oldu')
                }
                const data = await response.data
                setBlogs(data)
                setIsLoading(false)
            } catch (err) {
                setError('Bloqları əldə edərkən xəta baş verdi')
                setIsLoading(false)
            }
        }

        fetchBlogs()
    }, [])

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">Bloqlar</h1>
            <Button onClick={() => navigate('/admin/blogs/create')}>
                <Plus className="h-4 w-4 mr-2"/>
                Blog Yarat
            </Button>
            {isLoading ? (
                <BlogTableSkeleton/>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <BlogTable blogs={blogs}/>
            )}
        </div>
    )
}
