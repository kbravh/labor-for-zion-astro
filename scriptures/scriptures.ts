export type Work = {
	link: string;
	name: string;
	books: Book[];
};
export type Book = {
	name: string;
	summary?: string;
	chapters: Chapter[];
};

export type Chapter = {
	number?: number;
	summary?: string;
	verses: Verse[];
};

export type Verse = {
	number: number;
	text: string;
};
