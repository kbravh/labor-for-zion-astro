import slugify from "slugify";

// Shamelessly borrowed from https://github.com/jlengstorf/get-share-image.
// My Cloudinary URL is different enough that I need to customize it.
type Gravity =
	| "north_east"
	| "north"
	| "north_west"
	| "west"
	| "south_west"
	| "south"
	| "south_east"
	| "east"
	| "center";

type GetShareImageConfig = {
	title: string;
	tagline?: string;
	cloudName: string;
	imagePublicID: string;

	/**
	 * Only needed if you have a custom Cloudinary URL
	 * @default 'https://res.cloudinary.com'
	 */
	cloudinaryUrlBase?: string;

	/**
	 * @default 'arial'
	 */
	titleFont?: string;
	titleExtraConfig?: string;
	taglineExtraConfig?: string;

	/**
	 * @default 'arial'
	 */
	taglineFont?: string;

	/**
	 * @default 1280
	 */
	imageWidth?: number;

	/**
	 * @default 669
	 */
	imageHeight?: number;

	/**
	 * @default 760
	 */
	textAreaWidth?: number;

	/**
	 * @default 480
	 */
	textLeftOffset?: number;

	/**
	 * @default 'south_west'
	 */
	titleGravity?: Gravity;

	/**
	 * @default 'north_west'
	 */
	taglineGravity?: Gravity;
	titleLeftOffset?: number | null;
	taglineLeftOffset?: number | null;

	/**
	 * @default 254
	 */
	titleBottomOffset?: number;

	/**
	 * @default 445
	 */
	taglineTopOffset?: number;

	/**
	 * @default '000000'
	 */
	textColor?: string;
	titleColor: string;
	taglineColor: string;

	/**
	 * @default 64
	 */
	titleFontSize?: number;

	/**
	 * @default 48
	 */
	taglineFontSize?: number;

	version?: string | null;
};

/**
 * Encodes characters for Cloudinary URL
 * Encodes some not allowed in Cloudinary parameter values twice:
 *   hash (#), comma (,), slash (/), question mark (?), backslash (\)
 *
 * @see https://support.cloudinary.com/hc/en-us/articles/202521512-How-to-add-a-slash-character-or-any-other-special-characters-in-text-overlays-
 */
function cleanText(text: string): string {
	return encodeURIComponent(text).replace(/%(23|2C|2F|3F|5C)/g, "%25$1");
}

/**
 * Generates a social sharing image with custom text using Cloudinary’s APIs.
 *
 * @see https://cloudinary.com/documentation/image_transformations#adding_text_captions
 */
export function generateSocialImage({
	title,
	tagline,
	imagePublicID,
	titleFont = "arial",
	titleExtraConfig = "",
	taglineExtraConfig = "",
	taglineFont = "arial",
	imageWidth = 1280,
	imageHeight = 669,
	textAreaWidth = 760,
	textLeftOffset = 480,
	titleGravity = "south_west",
	taglineGravity = "north_west",
	titleLeftOffset = null,
	taglineLeftOffset = null,
	titleBottomOffset = 254,
	taglineTopOffset = 445,
	textColor = "000000",
	titleColor,
	taglineColor,
	titleFontSize = 64,
	taglineFontSize = 48,
	version = null,
}: GetShareImageConfig): string {
	// configure social media image dimensions, quality, and format
	const imageConfig = [
		`w_${imageWidth}`,
		`h_${imageHeight}`,
		"c_fill",
		"q_auto",
		"f_auto",
	].join(",");

	// configure the title text
	const titleConfig = [
		`w_${textAreaWidth}`,
		"c_fit",
		`co_rgb:${titleColor || textColor}`,
		`g_${titleGravity}`,
		`x_${titleLeftOffset || textLeftOffset}`,
		`y_${titleBottomOffset}`,
		`l_text:${titleFont}_${titleFontSize}${titleExtraConfig}:${cleanText(
			title,
		)}`,
	].join(",");

	// configure the tagline text
	const taglineConfig = tagline
		? [
				`w_${textAreaWidth}`,
				"c_fit",
				`co_rgb:${taglineColor || textColor}`,
				`g_${taglineGravity}`,
				`x_${taglineLeftOffset || textLeftOffset}`,
				`y_${taglineTopOffset}`,
				`l_text:${taglineFont}_${taglineFontSize}${taglineExtraConfig}:${cleanText(
					tagline,
				)}`,
			].join(",")
		: undefined;

	// combine all the pieces required to generate a Cloudinary URL
	const urlParts = [
		"https://res.cloudinary.com/drn1fmjus",
		"image",
		"upload",
		imageConfig,
		titleConfig,
		taglineConfig,
		version,
		"laborforzion",
		imagePublicID,
	];

	// remove any falsy sections of the URL (e.g. an undefined version)
	const validParts = urlParts.filter(Boolean);

	// join all the parts into a valid URL to the generated image
	return validParts.join("/");
}

/**
 * Converts an array of tags into a space-separated string of hashtags.
 * Each tag is slugified (converted to lowercase, special characters removed) and prefixed with '#'.
 *
 * @param {string[]} [tags] - Optional array of tag strings
 * @returns {string} A space-separated string of hashtags (e.g., "#tag1 #tag2") or an empty string if no tags provided
 */
export const createTaglineFromTags = (tags?: string[]): string =>
	tags
		? tags
				.map((tag) => slugify(tag, { lower: true }))
				.map((tag) => `#${tag}`)
				.join(" ")
		: "";
