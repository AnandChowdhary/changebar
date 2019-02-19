import { LibraryInterface, Constructor } from "./interfaces";
import "./styles.scss";
export default class Changebar implements LibraryInterface {
    repo: string;
    file: string;
    heading: string;
    element?: HTMLElement;
    hide?: string;
    container?: HTMLDivElement;
    totalCount?: number;
    readCount?: number;
    constructor({ element, repo, file, heading, hide }: Constructor);
    append(text: string): void;
    updateCounts(): void;
    updateStore(): void;
    generateCdnUrl(hash: string): string;
    fetchFileContents(url: string): Promise<{}>;
    fetchGitHubHash(): Promise<{}>;
    isOpen(): boolean | null;
    toggle(): void;
    close(): void;
    open(): void;
}
