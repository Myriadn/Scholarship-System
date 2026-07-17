import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ClipboardList, FileSpreadsheet, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage().props as { auth: { user: { role: string } } };
    const role = auth?.user?.role;

    const mainNavItems: NavItem[] = getNavItems(role);

    const footerNavItems: NavItem[] = [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={'/' + getDashboardRoute(role)} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

function getDashboardRoute(role?: string): string {
    switch (role) {
        case 'siswa':
            return 'siswa/dashboard';
        case 'staf_tu':
            return 'staf-tu/dashboard';
        case 'kepala_sekolah':
            return 'kepala-sekolah/laporan';
        default:
            return 'dashboard';
    }
}

function getNavItems(role?: string): NavItem[] {
    switch (role) {
        case 'siswa':
            return [
                { title: 'Dashboard', url: '/siswa/dashboard', icon: LayoutGrid },
                { title: 'Pendaftaran Beasiswa', url: '/siswa/pendaftaran', icon: ClipboardList },
            ];
        case 'staf_tu':
            return [
                { title: 'Dashboard', url: '/staf-tu/dashboard', icon: LayoutGrid },
                { title: 'Data Siswa', url: '/staf-tu/data-siswa', icon: ClipboardList },
                { title: 'Verifikasi Berkas', url: '/staf-tu/verifikasi-berkas', icon: FileSpreadsheet },
                { title: 'Kelola Kriteria', url: '/staf-tu/kelola-kriteria', icon: SlidersHorizontal },
            ];
        case 'kepala_sekolah':
            return [{ title: 'Laporan & Validasi', url: '/kepala-sekolah/laporan', icon: FileSpreadsheet }];
        default:
            return [{ title: 'Dashboard', url: '/dashboard', icon: LayoutGrid }];
    }
}
