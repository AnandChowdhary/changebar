interface LibraryInterface {
  repo: string;
  file: string;
  element?: HTMLElement;
}

interface ChangebarConstructor {
  element: string;
  repo: string;
  file: string;
}

interface GitHubResponse {
  sha: string;
  node_id: string;
  commit: any;
}

export { LibraryInterface, GitHubResponse, ChangebarConstructor };
