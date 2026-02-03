<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { usePlaygroundStore } from '@/stores/playground'

const store = usePlaygroundStore()
const iframeRef = ref<HTMLIFrameElement | null>(null)
const error = ref<string | null>(null)

const previewHtml = computed(() => {
  const mainContent = store.files['/main.ts']?.content || ''
  const appContent = store.files['/App.vue']?.content || ''

  // Generate HTML that includes Vue from CDN
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vue Preview</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"><\/script>
    <style>
      body { margin: 0; font-family: system-ui, sans-serif; }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script>
      const { createApp, ref: _ref } = Vue;

      // Simple SFC parser - extracts template, script, and styles
      function parseSFC(content) {
        const templateMatch = content.match(/<template>([\s\S]*?)<\/template>/);
        const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/);
        const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/);

        return {
          template: templateMatch ? templateMatch[1].trim() : '<div></div>',
          script: scriptMatch ? scriptMatch[1] : '',
          styles: styleMatch ? styleMatch[1] : ''
        };
      }

      // Create component from App.vue content
      function createAppComponent() {
        const sfc = parseSFC(\`${appContent.replace(/`/g, '\\`')}\`);
        const scriptContent = sfc.script;

        // Extract setup function or options
        const setupMatch = scriptContent.match(/<script setup[^>]*>([\s\S]*?)<\/script>/);
        const setupCode = setupMatch ? setupMatch[1] : '';

        // Create reactive state and functions from setup
        const setupFn = new Function('Vue', \`with (Vue) { \${setupCode} }\`)({ ref: _ref });

        return {
          template: sfc.template,
          setup() {
            return setupFn || {};
          }
        };
      }

      // Mount the app
      try {
        const App = createAppComponent();
        createApp(App).mount('#app');
      } catch (e) {
        document.body.innerHTML = '<div style="color: red; padding: 20px;"><h3>Runtime Error</h3><pre>' + e.message + '</pre></div>';
        console.error(e);
      }
    <\/script>
  </body>
</html>`
})

function updatePreview() {
  if (!iframeRef.value) return

  error.value = null
  const doc = iframeRef.value.contentDocument || iframeRef.value.contentWindow?.document
  if (doc) {
    doc.open()
    doc.write(previewHtml.value)
    doc.close()
  }
}

let updateTimeout: number | null = null

function debouncedUpdate() {
  if (updateTimeout) {
    clearTimeout(updateTimeout)
  }
  updateTimeout = setTimeout(updatePreview, 300)
}

onMounted(() => {
  updatePreview()
})

onUnmounted(() => {
  if (updateTimeout) {
    clearTimeout(updateTimeout)
  }
})

// Update preview when active file content changes
watch(
  () => store.activeFile?.content,
  () => {
    debouncedUpdate()
  }
)

// Also update when any file changes
watch(
  () => Object.keys(store.files),
  () => {
    debouncedUpdate()
  }
)
</script>

<template>
  <div class="h-full flex flex-col bg-white">
    <!-- Preview Header -->
    <div class="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200">
      <span class="text-sm font-medium text-gray-700">Preview</span>
      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-500">Live</span>
        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
      </div>
    </div>

    <!-- Error Display -->
    <div
      v-if="error"
      class="bg-red-50 text-red-700 px-4 py-2 text-sm border-b border-red-200"
    >
      {{ error }}
    </div>

    <!-- Iframe Preview -->
    <iframe
      ref="iframeRef"
      class="flex-1 w-full border-none"
      sandbox="allow-scripts allow-modals"
    ></iframe>
  </div>
</template>
