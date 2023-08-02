import { scrypt, randomBytes, createHash } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(scrypt)

export class Password {
    static async toHash(password: string) {
        const salt = randomBytes(8).toString('hex')
        const buf = (await scryptAsync(password, salt, 64)) as Buffer

        return `${buf.toString('hex')}.${salt}`
    }

    static async compare(storedPassword: string, candidatePassword: string) {
        console.log(storedPassword, candidatePassword)
        const [hashedPassword, salt] = storedPassword.split('.')
        const buf = (await scryptAsync(candidatePassword, salt, 64)) as Buffer

        return buf.toString('hex') === hashedPassword
    }

    static createResetToken() {
        return randomBytes(32).toString('hex')
    }
}
