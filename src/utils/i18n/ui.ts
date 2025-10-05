import type { Locale } from "@validation/i18n";

export type UI =
	| "backlinks"
	| "all_topics"
	| "browse_by_topic"
	| "empty"
	| "menu"
	| "next"
	| "note"
	| "note_about"
	| "notes"
	| "notes_about"
	| "page"
	| "previous"
	| "recent"
	| "recent_notes_404"
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
		all_topics: "All topics",
		browse_by_topic: "Browse by topic",
		empty:
			"This page hasn't been created yet! But if it has been mentioned somewhere else, you can see those references below.",
		menu: "Menu",
		next: "Next page",
		note: "note",
		note_about: "A note about",
		notes: "notes",
		notes_about: "Notes about: ",
		page: "Page",
		previous: "Previous page",
		recent: "Recent articles",
		recent_notes_404: "Here are some recent notes instead:",
		see_more: "See more",
		rss: "Grab the RSS Feed",
		translation: "Read this article in",
		toc: "Table of Contents",
		views: "Page views",
		"404": "Oops! That page doesn't exist.",
	},
	es: {
		backlinks: "Páginas que mencionan esta nota:",
		all_topics: "Todos los temas",
		browse_by_topic: "Explorar por tema",
		empty:
			"Esta página aún no se ha creado! Pero si ha sido mencionado en otro lado, podrás ver esas referencias aquí.",
		menu: "Menú",
		next: "Siguiente",
		note: "nota",
		note_about: "Una nota sobre",
		notes: "notas",
		notes_about: "Notas sobre: ",
		page: "Página",
		previous: "Anterior",
		recent: "Artículos recientes",
		recent_notes_404: "Aquí hay algunas notas recientes en su lugar:",
		rss: "Fuente RSS",
		see_more: "Ver más",
		translation: "Leer este artículo en",
		toc: "Índice",
		views: "Vistas de página",
		"404": "¡Vaya! Esa página no existe.",
	},
} as const;
