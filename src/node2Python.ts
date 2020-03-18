import { spawn } from "child_process";

export async function pythonShell(
	script: string,
	data: JSON | Object
): Promise<JSON> {
	const pythonProcess = spawn("python", [
		`${__dirname}\\${script}`,
		JSON.stringify(data),
	]);
	return await new Promise((res, rej) => {
		const stdout = [];
		const stderr = [];
		pythonProcess.stdout.on("data", data => stdout.push(data.toString()));
		pythonProcess.stderr.on("data", data => stderr.push(data.toString()));
		pythonProcess.on("close", code => {
			if (code !== 0) {
				const errorMessage = stderr.join("");
				rej(errorMessage);
			} else {
				const pythonResult = JSON.parse(stdout.join(""));
				res(pythonResult);
			}
		});
	});
}

async function init() {
	const aaa = await pythonShell("test2.py", { a: 1, b: 2 });
	console.log(aaa);
}
init();
