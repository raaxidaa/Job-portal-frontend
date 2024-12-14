import React from 'react';
import {Outlet} from 'react-router-dom';
import {SidebarProvider} from "@/Components/ui/sidebar";
import {DynamicSidebar} from "@/Components/DynamicSidebar";
import {Briefcase, ChartColumnStacked, Factory, FileText, Rss} from "lucide-react";

const AdminDashboardLayout = () => {

    const sidebarItems = [
        {name: 'Sənayelər', icon: Factory, path: '/admin/industries'},
        {name: 'Vakansiyalar', icon: Briefcase, path: '/admin/vacancies'},
        {name: 'Kateqoriyalar', icon: ChartColumnStacked, path: '/admin/categories'},
        {name: 'Şirkətlər', icon: FileText, path: '/admin/companies'},
        {name: 'Bloqlar', icon: Rss, path: '/admin/blogs'}
        
    ]

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <DynamicSidebar sidebarItems={sidebarItems}/>
                <main className="flex-1 w-0">
                    <Outlet/>
                </main>
            </div>
        </SidebarProvider>
    );
};

export default AdminDashboardLayout;