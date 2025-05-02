import type { Heading } from "@validation/md";
import { parseHTML } from "linkedom";

export const getHeadings = (source: string): Heading[] => {
	const headings: Heading[] = [];
	const { document } = parseHTML(source);
	for (const heading of document.querySelectorAll("h1, h2, h3, h4, h5, h6")) {
		const id = heading.getAttribute("id");
		if (!id) {
			continue;
		}
		headings.push({
			id,
			text: heading.textContent ?? "",
			level: Number.parseInt(heading.tagName[1]),
		});
	}
	return headings;
};
