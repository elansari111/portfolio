import test from 'node:test'
import assert from 'node:assert/strict'
import { validateContact, hasConfirmedDelivery } from '../src/lib/contactForm.js'
const accepted = value => ({ status: 'fulfilled', value })
test('requires a name, valid email, and nonblank message', () => {
    assert.deepEqual(Object.keys(validateContact({name:' ',email:'invalid',message:' '})), ['name','email','message'])
    assert.deepEqual(validateContact({name:'Visitor',email:' visitor@example.org ',message:'Hello'}), {})
})
test('unconfigured storage and rejected email do not report success', () => {
    assert.equal(hasConfirmedDelivery([accepted({success:true,localOnly:true}),{status:'rejected',reason:new Error('offline')}]), false)
})
test('one real accepted channel is enough, even if the other fails', () => {
    assert.equal(hasConfirmedDelivery([{status:'rejected'},accepted({success:true})]), true)
    assert.equal(hasConfirmedDelivery([accepted({success:true,localOnly:true}),accepted({success:true})]), true)
})
test('an empty or unsuccessful delivery result is not confirmation', () => {
    assert.equal(hasConfirmedDelivery([]), false)
    assert.equal(hasConfirmedDelivery([accepted({success:false}),accepted(null)]), false)
})
