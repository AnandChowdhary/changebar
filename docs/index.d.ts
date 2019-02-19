import { LibraryInterface, ChangebarConstructor } from "./interfaces";
import "./styles.scss";
export default class Changebar implements LibraryInterface {
    repo: string;
    file: string;
    element?: HTMLElement;
    constructor({ element, repo, file }: ChangebarConstructor);
    append(text: string): void;
    updateStore(): void;
    generateCdnUrl(hash: string): string;
    fetchFileContents(url: string): Promise<{}>;
    fetchGitHubHash(): Promise<{}>;
    isOpen(): boolean | null;
    toggle(): void;
    close(): void;
    open(): void;
}
