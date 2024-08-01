import type {Locale} from '@validation/i18n';

export type Route = '/' | '/about' | '/notes' | '/projects';

export const routes: Route[] = ['/', '/notes', '/projects', '/about'];

type RouteMap = {
  [k in Locale]: {
    [k in Route]: string;
  };
};

export const routeMap: RouteMap = {
  en: {
    '/': 'Home',
    '/notes': 'Notes',
    '/projects': 'Projects',
    '/about': 'About',
  },
  es: {
    '/': 'Inicio',
    '/notes': 'Notas',
    '/projects': 'Proyectos',
    '/about': 'Acerca de',
  },
};
