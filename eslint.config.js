import eslint from "@eslint/js";
import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{
		ignores: [
			"dist/**",
			"coverage/**",
			"node_modules/**",
			"public/**",
			".astro/**",
			"data/**",
			"src/data/**",
			"out/**",
		],
	},
	eslint.configs.recommended,
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	...eslintPluginAstro.configs.recommended,
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		files: ["**/*.js", "**/*.mjs", "**/*.astro"],
		...tseslint.configs.disableTypeChecked,
	},
);
