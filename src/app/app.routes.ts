import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    component: LayoutComponent,
    path: '',
    children: [
      {
        path: 'home',
        component: HomePage,
        data: {
          title: 'Home',
        },
      },
    ],
  },
];
