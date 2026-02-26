import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  react: true,
  stylistic: false,
  ignores: [
    '.agents/**/*',
    '.claude/**/*',
    '.cursor/**/*',
    '.vscode/**/*',
    'components/ai-elements/**/*',
    'components/ui/**/*',
  ]
})
