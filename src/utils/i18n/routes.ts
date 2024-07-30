import type {Locale} from '@validation/i18n';

export type Route = '/' | '/about' | '/notes' | '/projects';

export const routes: Route[] = ['/', '/notes', '/projects', '/about'];

type RouteMap = {
  [k in Locale]: Record<Route, string>;
};

const routeMap: RouteMap = {
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

export const getRouteTitle = ({
  locale,
  slug,
}: {
  locale: Locale;
  slug: Route;
}): string => routeMap[locale][slug];
