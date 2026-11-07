export function validateContact(values) {
    const errors = {}
    if (!values.name.trim()) errors.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Please enter a valid email address.'
    if (!values.message.trim()) errors.message = 'Please tell me a little about your project or opportunity.'
    return errors
}
export function hasConfirmedDelivery(results) {
    return results.some(result => result.status === 'fulfilled' && result.value?.success === true && !result.value.localOnly)
}
