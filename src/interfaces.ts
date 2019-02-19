interface LibraryInterface {
  repo: string;
  file: string;
  element?: HTMLElement;
}

interface Constructor {
  element: string;
  repo: string;
  file: string;
  heading?: string;
  hide?: string;
  container?: HTMLDivElement;
  totalCount?: number;
  readCount?: number;
}

interface GitHubResponse {
  sha: string;
  node_id: string;
  commit: any;
}

export { LibraryInterface, GitHubResponse, Constructor };
