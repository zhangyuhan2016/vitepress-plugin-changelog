<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
const { page } = useData()

const CommitData = computed(() => page.value?.CommitData || {})
const allCommits = computed(() => CommitData.value?.changelog || [])
const commitURL = computed(() => CommitData.value?.commitURL || '')
const title = computed(() => CommitData.value?.title || 'Changelog')
const contributors = computed(() => CommitData.value?.contributors || [])

const commits = computed(() => {
  const related = allCommits.value || []

  return related.filter((i, idx) => {
    if (i.version && (!related[idx + 1] || related[idx + 1]?.version))
      return false
    return true
  })
})
</script>

<template>
  <div class="common-git-card" v-if="commits.length">
    <h2>{{title}}</h2>
    <ul class="changelog">
      <li v-for="commit of commits" :key="commit.hash">
        <div class="changelog-item flex-warp">
          <a class="commit-link" :href="`${commitURL}${commit.hash}`" target="_blank">
            <code>{{ commit.hash.slice(0, 5) }}</code>
          </a>
          <span class='commit-content' v-html="commit.message" />
          <time class='commit-time'>{{ new Date(commit.date).toLocaleDateString() }}</time>
        </div>
      </li>
    </ul>
    <div class="contributors flex-warp">
      <div v-for="c of contributors" :key="c.hash" class="contributor-item">
        <img :src="`https://gravatar.com/avatar/${c.hash}?d=retro`" class="contributor-avatar" :alt="c.name" :title='c.name'>
      </div>
    </div>
  </div>
</template>

