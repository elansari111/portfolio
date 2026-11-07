export function projectMatches(project, filter) {
 const tags = (project.tags || []).join(' ')
 const mobile = /native|expo|mobile/i.test(tags)
 if (filter === 'All') return true
 if (filter === 'Mobile') return mobile
 if (filter === 'AI') return /ai|openai|python|langchain/i.test(tags)
 return !mobile
}
