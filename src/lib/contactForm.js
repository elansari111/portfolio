export function validateContact(values) {
    const errors = {}
    const name = (values?.name || '').trim()
    const email = (values?.email || '').trim()
    const message = (values?.message || '').trim()

    if (!name) {
        errors.name = 'Please enter your name.'
    } else if (name.length > 100) {
        errors.name = 'Name must be 100 characters or fewer.'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Please enter a valid email address.'
    } else if (email.length > 150) {
        errors.email = 'Email must be 150 characters or fewer.'
    }

    if (!message) {
        errors.message = 'Please tell me a little about your project or opportunity.'
    } else if (message.length > 3000) {
        errors.message = 'Message must be 3000 characters or fewer.'
    }

    return errors
}
export function hasConfirmedDelivery(results) {
    return results.some(result => result.status === 'fulfilled' && result.value?.success === true && !result.value.localOnly)
}
