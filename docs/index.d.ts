import { LibraryInterface, ChangebarConstructor } from "./interfaces";
import "./styles.scss";
export default class Changebar implements LibraryInterface {
    repo: string;
    file: string;
    heading: string;
    element?: HTMLElement;
    hide?: string;
    container?: HTMLDivElement;
    constructor({ element, repo, file, heading, hide }: ChangebarConstructor);
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
