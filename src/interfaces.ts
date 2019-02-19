interface LibraryInterface {
  repo: string;
  file: string;
  element?: HTMLElement;
}

interface ChangebarConstructor {
  element: string;
  repo: string;
  file: string;
  heading?: string;
  hide?: string;
  container?: HTMLDivElement;
}

interface GitHubResponse {
  sha: string;
  node_id: string;
  commit: any;
}

export { LibraryInterface, GitHubResponse, ChangebarConstructor };
