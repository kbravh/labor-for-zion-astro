import type { Locale } from "@validation/i18n";

export type Route = "/" | "/about" | "/notes" | "/topics" | "/projects";

export const routes: Route[] = ["/", "/notes", "/projects", "/about"];

type RouteMap = {
  [k in Locale]: {
    [k in Route]: string;
  };
};

export const routeMap: RouteMap = {
  en: {
    "/": "Home",
    "/notes": "Notes",
    "/topics": "Topics",
    "/projects": "Projects",
    "/about": "About",
  },
  es: {
    "/": "Inicio",
    "/notes": "Notas",
    "/topics": "Temas",
    "/projects": "Proyectos",
    "/about": "Acerca de",
  },
};
