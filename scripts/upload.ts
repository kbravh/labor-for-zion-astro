import "dotenv/config";
import { exec } from "node:child_process";
import { readdir } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { promisify } from "node:util";
import { z } from "zod";

const execPromise = promisify(exec);

async function runCommand(command: string): Promise<void> {
	try {
		const { stdout, stderr } = await execPromise(command);
		if (stderr) {
			throw new Error(stderr);
		}
	} catch (error) {
		console.error(`Execution failed: ${error}`);
	}
}

const CredSchema = z.object({
	bucket: z.string(),
});

const creds = CredSchema.parse({
	bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
});

const upload = async (pathToDir: string) => {
	const uploadLocation = `${creds.bucket}/videos/${basename(pathToDir)}`;
	console.info(`Uploading files to ${uploadLocation}`);
	const files = await readdir(resolve(pathToDir));

	for (const file of files) {
		console.info(`Uploading ${file}`);
		const filepath = resolve(pathToDir, file);
		try {
			await runCommand(
				`npx wrangler r2 object put ${uploadLocation}/${file} --file ${filepath} --remote`,
			);
		} catch (error) {
			console.error(error);
			throw new Error("Error uploading file");
		}
	}
};

const filename = process.argv[2];
if (!filename) {
	console.error("No filename provided");
	process.exit(1);
}
await upload(`./video_output/${filename}`);
