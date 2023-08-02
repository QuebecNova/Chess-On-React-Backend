import crypto from 'crypto'
export const encrypt = (value: string) => {
    return crypto
        .createHash('sha256')
        .update(value)
        .digest('hex')
}