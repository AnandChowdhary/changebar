import { LibraryInterface, ChangebarConstructor } from "./interfaces";
export default class Changebar implements LibraryInterface {
    repo: string;
    file: string;
    element?: HTMLElement;
    constructor({ element, repo, file }: ChangebarConstructor);
    generateCdnUrl(hash: string): string;
    fetchFileContents(url: string): Promise<{}>;
    fetchGitHubHash(): Promise<{}>;
    open(): void;
}
