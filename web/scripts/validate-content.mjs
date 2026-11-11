import { createServer } from 'vite'

const server = await createServer({
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true },
})

try {
  const { validateContent } = await server.ssrLoadModule('/src/game/content/validate.ts')
  const issues = validateContent()
  const errors = issues.filter((i) => i.level === 'error')
  const warnings = issues.filter((i) => i.level === 'warning')

  for (const issue of issues) {
    console.log(`${issue.level.toUpperCase()} [${issue.area}] ${issue.message}`)
  }

  console.log(`\ncontent validation: ${errors.length} errors, ${warnings.length} warnings`)
  if (errors.length > 0) process.exitCode = 1
} finally {
  await server.close()
}
