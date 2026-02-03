<script setup lang="ts">
import { usePlaygroundStore } from '@/stores/playground'

const store = usePlaygroundStore()

function closeTab(path: string, event: Event) {
  event.stopPropagation()
  store.closeFile(path)
}

function selectTab(path: string) {
  store.setActiveFile(path)
}
</script>

<template>
  <div class="flex items-center bg-gray-800 border-b border-gray-700 overflow-x-auto">
    <div
      v-for="path in store.openFiles"
      :key="path"
      @click="selectTab(path)"
      class="flex items-center px-3 py-2 min-w-0 cursor-pointer border-r border-gray-700 hover:bg-gray-700 transition-colors"
      :class="store.activeFilePath === path ? 'bg-gray-700 text-blue-400' : 'text-gray-300'"
    >
      <span class="text-xs mr-1 opacity-50">
        {{ path.endsWith('.vue') ? '(.vue)' : path.split('.').pop() }}
      </span>
      <span class="text-sm truncate max-w-32">
        {{ path.split('/').pop() }}
      </span>
      <span
        v-if="store.files[path]?.isModified"
        class="ml-1 w-2 h-2 bg-yellow-500 rounded-full"
        title="Unsaved changes"
      ></span>
      <button
        @click="closeTab(path, $event)"
        class="ml-2 text-gray-500 hover:text-white text-lg leading-none"
      >
        ×
      </button>
    </div>
  </div>
</template>
