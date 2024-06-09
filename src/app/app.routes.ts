import { Routes } from '@angular/router';

export const routes: Routes = [
    // {
    //     path: '',
    //     loadComponent: () => import('./app.component').then(m => m.AppComponent)
    // },
    {
        path: '',
        loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
        children: [

            {
                path: 'reader',
                loadComponent: () => import('./nfc-reader/nfc-reader.component').then(m => m.NfcReaderComponent)
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: '**',
                redirectTo: 'dashboard'
            }
        ]
    }
];
