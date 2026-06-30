import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default defineConfig(
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
			"src/env.d.ts",
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
		rules: {
			"@typescript-eslint/restrict-template-expressions": [
				"error",
				{ allowNumber: true },
			],
		},
	},
	{
		files: ["**/*.js", "**/*.mjs", "**/*.astro"],
		...tseslint.configs.disableTypeChecked,
	},
);
