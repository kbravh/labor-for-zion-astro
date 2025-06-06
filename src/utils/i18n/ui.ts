import type { Locale } from "@validation/i18n";

export type UI =
	| "backlinks"
	| "empty"
	| "menu"
	| "next"
	| "note_about"
	| "notes_about"
	| "page"
	| "previous"
	| "recent"
	| "see_more"
	| "translation"
	| "rss"
	| "toc"
	| "views"
	| "404";

export type UIMap = {
	[k in Locale]: {
		[k in UI]: string;
	};
};

export const uiMap: UIMap = {
	en: {
		backlinks: "Pages that reference this note:",
		empty:
			"This page hasn't been created yet! But if it has been mentioned somewhere else, you can see those references below.",
		menu: "Menu",
		next: "Next page",
		note_about: "A note about",
		notes_about: "Notes about: ",
		page: "Page",
		previous: "Previous page",
		recent: "Recent articles",
		see_more: "See more",
		rss: "Grab the RSS Feed",
		translation: "Read this article in",
		toc: "Table of Contents",
		views: "Page views",
		"404": "Oops! That page doesn't exist.",
	},
	es: {
		backlinks: "Páginas que mencionan esta nota:",
		empty:
			"Esta página aún no se ha creado! Pero si ha sido mencionado en otro lado, podrás ver esas referencias aquí.",
		menu: "Menú",
		next: "Siguiente",
		note_about: "Una nota sobre",
		notes_about: "Notas sobre: ",
		page: "Página",
		previous: "Anterior",
		recent: "Artículos recientes",
		rss: "Fuente RSS",
		see_more: "Ver más",
		translation: "Leer este artículo en",
		toc: "Índice",
		views: "Vistas de página",
		"404": "¡Vaya! Esa página no existe.",
	},
} as const;
