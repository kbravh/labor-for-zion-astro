import type { Locale } from "@validation/i18n";

enum Projects {
	scriptly = "scriptly",
	vault = "vault",
}

export type Project = keyof typeof Projects;

export type ProjectMap = {
	[k in Locale]: {
		[k in Project]: {
			title: string;
			description: string;
		};
	};
};

export const projectMap: ProjectMap = {
	en: {
		scriptly: {
			title: "Scriptly",
			description:
				"Style your patriarchal blessing to look like a page right out of the scriptures.",
		},
		vault: {
			title: "LDS Scripture Obsidian Vault",
			description:
				"Take notes on the scriptures using Obsidian, a note-taking tool that will help you connect ideas and think more deeply about the scriptures.",
		},
	},
	es: {
		scriptly: {
			title: "Scriptly",
			description:
				"Da a tu bendición patriarcal un estilo como si fuera una página sacada de las mismísimas escrituras.",
		},
		vault: {
			title: "Bóveda de Obisidian de las escrituras",
			description:
				"Toma notas sobre las escrituras en Obsidian, una aplicación que te ayudará a conectar tus ideas y pensar más profundamente sobre las escrituras.",
		},
	},
};
