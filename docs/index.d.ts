import { LibraryInterface, ChangebarConstructor } from "./interfaces";
export default class Changebar implements LibraryInterface {
    repo: string;
    file: string;
    constructor({ element, repo, file }: ChangebarConstructor);
    fetchGitHubHash(): Promise<{}>;
    open(): void;
}
