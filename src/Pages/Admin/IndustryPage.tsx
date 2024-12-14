import React, { useState, useEffect } from 'react';
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Card, CardContent } from "@/Components/ui/card"
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast';
import axiosInstance from "@/lib/axiosInstance";

interface Industry {
    id: number;
    name: string;
}

const IndustryForm: React.FC<{
    industry?: Industry;
    onSubmit: (name: string, id?: number) => void;
}> = ({ industry, onSubmit }) => {
    const [name, setName] = useState(industry?.name || '');

    useEffect(() => {
        setName(industry?.name || '');
    }, [industry]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(name, industry?.id);
        setName('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Sənaye Adı</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1"
                />
            </div>
            <Button type="submit" className="w-full">
                {industry ? 'Sənayeni Yenilə' : 'Sənaye Əlavə Et'}
            </Button>
        </form>
    );
};

const IndustryList: React.FC<{
    industries: Industry[];
    onEdit: (industry: Industry) => void;
    onDelete: (id: number) => void;
}> = ({ industries, onEdit, onDelete }) => {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => (
                <Card key={industry.id} className="overflow-hidden">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">{industry.name}</h3>
                            <div className="flex space-x-2">
                                <Button
                                    onClick={() => onEdit(industry)}
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                >
                                    <Pencil className="h-4 w-4" />
                                    <span className="sr-only">Redaktə et</span>
                                </Button>
                                <Button
                                    onClick={() => onDelete(industry.id)}
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
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

export const IndustryPage: React.FC = () => {
    const [industries, setIndustries] = useState<Industry[]>([]);
    const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);

    useEffect(() => {
        fetchIndustries();
    }, []);

    const fetchIndustries = async () => {
        try {
            const response = await axiosInstance.get('/industries');
            setIndustries(response.data);
        } catch (error) {
            console.error('Sənayeləri çəkmək mümkün olmadı:', error);
            toast.error('Sənayeləri yükləmək mümkün olmadı. Zəhmət olmasa yenidən cəhd edin.');
        }
    };

    const handleSubmit = async (name: string, id?: number) => {
        try {
            if (id) {
                const response = await axiosInstance.put(`/admin/industries/${id}`, { name });
                setIndustries(prevIndustries =>
                    prevIndustries.map(industry =>
                        industry.id === id ? response.data.industry : industry
                    )
                );
                toast.success('Sənaye uğurla yeniləndi');
            } else {
                const response = await axiosInstance.post('/admin/industries', { name });
                setIndustries(prevIndustries => [...prevIndustries, response.data.industry]);
                toast.success('Sənaye uğurla yaradıldı');
            }
            setEditingIndustry(null);
        } catch (error) {
            console.error('Sənaye əlavə etmək mümkün olmadı:', error);
            toast.error('Sənaye saxlamaqda problem oldu. Zəhmət olmasa yenidən cəhd edin.');
        }
    };

    const handleEdit = (industry: Industry) => {
        setEditingIndustry(industry);
    };

    const handleDelete = async (id: number) => {
        try {
            await axiosInstance.delete(`/admin/industries/${id}`);
            setIndustries(prevIndustries => prevIndustries.filter(industry => industry.id !== id));
            toast.success('Sənaye uğurla silindi');
        } catch (error) {
            console.error('Sənaye silmək mümkün olmadı:', error);
            toast.error('Sənaye silmək mümkün olmadı. Zəhmət olmasa yenidən cəhd edin.');
        }
    };

    return (
        <div className="container mx-auto p-4 space-y-8">
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingIndustry ? 'Sənayeni Redaktə Et' : 'Yeni Sənaye Əlavə Et'}
                    </h2>
                    <IndustryForm
                        industry={editingIndustry || undefined}
                        onSubmit={handleSubmit}
                    />
                    {editingIndustry && (
                        <Button
                            onClick={() => setEditingIndustry(null)}
                            variant="outline"
                            className="mt-4 w-full"
                        >
                            Redaktəni Ləğv Et
                        </Button>
                    )}
                </CardContent>
            </Card>
            <div>
                <h2 className="text-2xl font-semibold mb-4">Mövcud Sənayelər</h2>
                <IndustryList
                    industries={industries}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
};
