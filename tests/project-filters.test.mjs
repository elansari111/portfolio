import test from 'node:test'
import assert from 'node:assert/strict'
import { projectMatches } from '../src/components/immersive/projectFilters.js'
test('All includes projects without tags', () => assert.equal(projectMatches({}, 'All'), true))
test('Native and Expo projects belong to Mobile and are excluded from Web', () => {
 const project = { tags: ['React Native', 'Expo'] }
 assert.equal(projectMatches(project, 'Mobile'), true)
 assert.equal(projectMatches(project, 'Web'), false)
})
test('AI identifies the supplied OpenAI and Python toolchains', () => {
 assert.equal(projectMatches({ tags: ['Next.js', 'OpenAI'] }, 'AI'), true)
 assert.equal(projectMatches({ tags: ['Python', 'React'] }, 'AI'), true)
 assert.equal(projectMatches({ tags: ['React', 'Stripe'] }, 'AI'), false)
})
test('Web excludes mobile without excluding normal React projects', () => {
 assert.equal(projectMatches({ tags: ['React', 'Vite'] }, 'Web'), true)
 assert.equal(projectMatches({ tags: ['React', 'Vite'] }, 'Mobile'), false)
})
