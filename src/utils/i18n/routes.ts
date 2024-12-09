import type { Locale } from "@validation/i18n";

export type Route = "/" | "/about" | "/notes" | "/topics" | "/projects" | "404";

// these routes are used to populate the nav
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
    "404": "404 Not Found"
  },
  es: {
    "/": "Inicio",
    "/notes": "Notas",
    "/topics": "Temas",
    "/projects": "Proyectos",
    "/about": "Acerca de",
    "404": "404 No encontrado"
  },
};
