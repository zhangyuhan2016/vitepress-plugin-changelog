/**
 * Code Copy From @vueuse
 * https://github.com/vueuse/vueuse
 */
import 'tslib'
import md5 from 'md5'
import Git from 'simple-git'

const git = Git({
  maxConcurrentProcesses: 200
})

export interface CommitInfo {
  functions: string[]
  version?: string
  hash: string
  date: string
  message: string
  refs?: string
  body?: string
  author_name: string
  author_email: string
}

export interface ContributorInfo {
  name: string
  count: number
  hash: string
  avatar: string
}

let cache: CommitInfo[] | undefined

export async function getChangelog(path: string, count = 200) {
  if (cache)
    return cache

  const logs = (await git.log({ maxCount: count, file: path })).all.filter((i) => {
    return i.message.includes('chore: release')
      || i.message.includes('!')
      || i.message.startsWith('feat')
      || i.message.startsWith('docs')
      || i.message.startsWith('fix')
  }) as CommitInfo[]

  cache = logs
  return logs
}

export async function getContributorsAt(path: string) {
  try {
    const list = (
      await git.raw(['log', '--pretty=format:"%an|%ae"', '--', path])
    )
      .split('\n')
      .map((i) => i.slice(1, -1).split('|') as [string, string])
    const map: Record<string, ContributorInfo> = {}

    list
      .filter((i) => i[1])
      .forEach((i) => {
        if (!map[i[1]]) {
          const hash = md5(i[1])
          map[i[1]] = {
            name: i[0],
            count: 0,
            hash,
            avatar: `https://gravatar.com/avatar/${hash}?d=retro`
          }
        }
        map[i[1]].count++
      })

    return Object.values(map)
      .sort((a, b) => b.count - a.count)
  } catch (e) {
    console.error(e)
    return []
  }
}

export async function getChangelogAndContributors(path: string) {
  try {
    const [contributors, changelog] = await Promise.all([
      getContributorsAt(path),
      getChangelog(path)
    ])

    return { contributors, changelog }
  } catch (error) {
    console.error('Error in getChangelogAndContributors:', error)
    throw error
  }
}

