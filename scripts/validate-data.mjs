import { createServer } from 'vite'

const server = await createServer({
  appType: 'custom',
  server: { middlewareMode: true, watch: null, ws: false },
})

try {
  const { validateData } = await server.ssrLoadModule('/src/utils/validateData.ts')
  const issues = validateData()
  if (issues.length) {
    console.error(issues.map((issue) => `- ${issue}`).join('\n'))
    process.exitCode = 1
  } else {
    console.log('Data validation passed.')
  }
} finally {
  await server.close()
}
