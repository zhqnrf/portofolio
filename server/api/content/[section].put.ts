export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const section = getRouterParam(event, 'section') ?? ''
  const body = await readBody<{ value: unknown }>(event)
  const content = await writeSection(section, body?.value)
  return content[section]
})
