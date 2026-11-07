import test from 'node:test'
import assert from 'node:assert/strict'
import { eventType, eventYear, filterEvents } from '../src/lib/eventFilters.js'
const events = [
    {id:1,title:'Global Hackathon',date:'Dec 2025',role:'Developer',award:'1st Place'},
    {id:2,title:'Web3 Buildathon',date:'Oct 2024',role:'Frontend Engineer'},
    {id:3,title:'DevFest',date:'Nov 2024',role:'Speaker',description:'React animations'},
]
test('classifies talks and buildathons without changing source data', () => {
    assert.equal(eventType(events[1]), 'Hackathons')
    assert.equal(eventType(events[2]), 'Talks & events')
    assert.equal(eventYear(events[0]), '2025')
})
test('sorts newest first within a year', () => {
    assert.deepEqual(filterEvents(events,{year:'2024'}).map(e=>e.id),[3,2])
    assert.deepEqual(events.map(e=>e.id),[1,2,3])
})
test('combines category, year and case-insensitive trimmed search', () => {
    assert.deepEqual(filterEvents(events,{category:'Talks & events',year:'2024',search:' REACT '}).map(e=>e.id),[3])
    assert.equal(filterEvents(events,{category:'Hackathons',year:'2024',search:'React'}).length,0)
})
test('supports empty archives and undated records', () => {
    assert.deepEqual(filterEvents([],{}),[])
    assert.equal(eventYear({}), 'Undated')
    assert.equal(filterEvents([{}],{year:'Undated'}).length,1)
})
