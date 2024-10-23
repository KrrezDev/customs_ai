import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./modules/public/menu/menu.component')
      .then(m => m.MenuComponent)
  },
  {
    path: 'gallery',
    loadComponent: () => import('./modules/public/gallery/gallery.component')
      .then(m => m.GalleryComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
