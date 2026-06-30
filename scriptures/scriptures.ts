export interface Work {
	link: string;
	name: string;
	books: Book[];
}
export interface Book {
	name: string;
	summary?: string;
	chapters: Chapter[];
}

export interface Chapter {
	number?: number;
	summary?: string;
	verses: Verse[];
}

export interface Verse {
	number: number;
	text: string;
}
