import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
            { path: 'reports', loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent) },
            { path: 'filters', loadComponent: () => import('./features/filters/filters.component').then(m => m.FiltersComponent) },
            { path: 'profile', loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent) },
            { path: 'admin', loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent) },
            { path: 'data-storage', loadComponent: () => import('./examples/data-storage-example/data-storage-example.component').then(m => m.DataStorageExampleComponent) },
        ]
    },
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    { path: '**', redirectTo: 'dashboard' }
];
