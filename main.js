import { simpleGit } from 'simple-git';
import { ChatOllama } from "@langchain/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { LoadingSpinner } from './loadingSpinner.js';

async function getChangedFiles() {
    const git = simpleGit();
    try {
        const diff = await git.diff();
        return diff;
    } catch (error) {
        console.error('Error fetching changed files:', error);
        process.exit(1);
    }
}

async function generateCommitMessage(files) {
    try {
        const spinner = new LoadingSpinner('Generating commit messages')
        const model = new ChatOllama({
            baseUrl: "http://localhost:11434", // Default value
            model: "llama3.1:latest",
        });
        spinner.start()
        const stream = await model
            .pipe(new StringOutputParser())
            .stream(`
            Please generate a commit message for the following code changes, adhering to the style below.
            This commit message follows standard professional guidelines, which include:
            - Starting with a type (e.g., 'feat', 'fix', etc.) that describes the nature of the change.
            - A brief description of the change itself.
            **Output:**
            For the given code changes, generate 3 commit message options: ${files}`);

        for await (const chunk of stream) {
            spinner.stop()
            process.stdout.write(chunk)
        }

        console.log('')
    } catch (error) {
        console.error('Error generating commit message:', error);
        process.exit(1);
    }
}

async function main() {
    const changedFiles = await getChangedFiles();
    generateCommitMessage(changedFiles);
}

main();


