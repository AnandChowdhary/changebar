interface LibraryInterface {
  repo: string;
  file: string;
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
