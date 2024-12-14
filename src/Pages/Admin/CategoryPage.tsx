import React, {useEffect, useState} from 'react';
import {Button} from "@/Components/ui/button"
import {Input} from "@/Components/ui/input"
import {Label} from "@/Components/ui/label"
import {Card, CardContent} from "@/Components/ui/card"
import {Pencil, Trash2} from 'lucide-react'
import {toast} from 'react-hot-toast';
import axiosInstance from "@/lib/axiosInstance";

interface Category {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

const CategoryForm: React.FC<{
    category?: Category;
    onSubmit: (name: string, id?: number) => void;
}> = ({category, onSubmit}) => {
    const [name, setName] = useState(category?.name || '');

    useEffect(() => {
        setName(category?.name || '');
    }, [category]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(name, category?.id);
        if (!category) {
            setName('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Kateqoriya Adı</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1"
                />
            </div>
            <Button type="submit" className="w-full">
                {category ? 'Kateqoriyanı Yenilə' : 'Kateqoriya Əlavə Et'}
            </Button>
        </form>
    );
};

const CategoryList: React.FC<{
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (id: number) => void;
}> = ({categories, onEdit, onDelete}) => {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
                <Card key={category.id} className="overflow-hidden">
                    <CardContent className="p-4">
                        <div className="flex flex-col space-y-2">
                            <h3 className="text-lg font-semibold">{category.name}</h3>
                            <div className="flex justify-end space-x-2">
                                <Button
                                    onClick={() => onEdit(category)}
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                >
                                    <Pencil className="h-4 w-4"/>
                                    <span className="sr-only">Düzəliş et</span>
                                </Button>
                                <Button
                                    onClick={() => onDelete(category.id)}
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive"
                                >
                                    <Trash2 className="h-4 w-4"/>
                                    <span className="sr-only">Sil</span>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export const CategoryPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Kateqoriyalar alınmadı:', error);
            toast.error('Kateqoriyalar yüklənmədi. Zəhmət olmasa yenidən cəhd edin.');
        }
    };

    const handleSubmit = async (name: string, id?: number) => {
        try {
            if (id) {
                await axiosInstance.put(`/categories/${id}`, { name });
                setCategories(prevCategories =>
                    prevCategories.map(category =>
                        category.id === id ? { ...category, name: name } : category
                    )
                );
                toast.success('Kateqoriya uğurla yeniləndi');
            } else {
                const response = await axiosInstance.post('/categories', { name });
                setCategories(prevCategories => [...prevCategories, response.data]);
                toast.success('Kateqoriya uğurla yaradıldı');
            }
            setEditingCategory(null);
        } catch (error) {
            console.error('Kateqoriya qeyd edilə bilmədi:', error);
            toast.error('Kateqoriya yaddaşa alınmadı. Zəhmət olmasa yenidən cəhd edin.');
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
    };

    const handleDelete = async (id: number) => {
        try {
            await axiosInstance.delete(`/categories/${id}`);
            setCategories(prevCategories => prevCategories.filter(category => category.id !== id));
            toast.success('Kateqoriya uğurla silindi');
        } catch (error) {
            console.error('Kateqoriya silinə bilmədi:', error);
            toast.error('Kateqoriya silinə bilmədi. Zəhmət olmasa yenidən cəhd edin.');
        }
    };

    return (
        <div className="container mx-auto p-4 space-y-8">
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingCategory ? 'Kateqoriyanı Düzəliş Et' : 'Yeni Kateqoriya Əlavə Et'}
                    </h2>
                    <CategoryForm
                        category={editingCategory || undefined}
                        onSubmit={handleSubmit}
                    />
                    {editingCategory && (
                        <Button
                            onClick={() => setEditingCategory(null)}
                            variant="outline"
                            className="mt-4 w-full"
                        >
                            Düzəlişi Ləğv Et
                        </Button>
                    )}
                </CardContent>
            </Card>
            <div>
                <h2 className="text-2xl font-semibold mb-4">Mövcud Kateqoriyalar</h2>
                <CategoryList
                    categories={categories}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
};
