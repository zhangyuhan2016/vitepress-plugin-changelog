// types/changelog.d.ts

export interface CommitInfo {
  functions: string[];
  version?: string;
  hash: string;
  date: string;
  message: string;
  refs?: string;
  body?: string;
  author_name: string;
  author_email: string;
}

export interface ContributorInfo {
  name: string;
  count: number;
  hash: string;
}

export function getChangeLog(path: string, count?: number): Promise<CommitInfo[]>;

export function getContributorsAt(path: string): Promise<ContributorInfo[]>;

export function getChangelogAndContributors(path: string): Promise<{ contributors: ContributorInfo[], changelog: CommitInfo[] }>;
