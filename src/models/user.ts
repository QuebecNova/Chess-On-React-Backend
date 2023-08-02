import mongoose from 'mongoose'
import { Password } from '../helpers/password'
import { encrypt } from '../helpers/encrypt'

interface UserAttrs {
    email: string
    password: string
    passwordConfirm: string
    photo?: string
    role?: string
}

interface UserModel extends mongoose.Model<UserDoc> {
    build: (attrs: UserAttrs) => Promise<UserDoc>
}

interface UserDoc extends mongoose.Document {
    email: string
    password: string
    passwordConfirm: string
    role: string
    photo?: string
    passwordChangedAt?: Date
    passwordResetToken?: string
    passwordResetExpires?: string
    correctPassword: (
        storedPassword: string,
        candidatePassword: string
    ) => Promise<boolean>
    createPasswordResetToken: () => string
}

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            maxLength: [20, 'User name max length is 20 chahacters'],
            minLength: [3, 'User name min length is 3 characters'],
        },
        email: {
            type: String,
            required: [true, 'User must have a email'],
            unique: true,
            trim: true,
            lowercase: true,
        },
        role: {
            type: String,
            enum: ['admin', 'user', 'lead-guide', 'guide'],
            default: 'user',
        },
        photo: { type: String, default: 'default.jpg' },
        password: {
            type: String,
            required: [true, 'User must have a password'],
            min: 8,
        },
        passwordConfirm: {
            type: String,
            required: [true, 'User must have passwordConfirm'],
            min: 8,
            validate: {
                validator: function (this: UserDoc, value: string): boolean {
                    return this.password === value
                },
                message: 'Passwords must be equal',
            },
            select: false,
        },
        passwordChangedAt: { type: Date, select: false },
        passwordResetToken: { type: String, select: false },
        passwordResetExpires: { type: String, select: false },
        active: {
            type: Boolean,
            default: true,
            select: false,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id
                delete ret._id
                delete ret.password
                delete ret.passwordConfirm
                delete ret.__v
            },
        },
    }
)

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.password!)
        this.password = hashed
        this.passwordConfirm = undefined
    }

    next()
})

userSchema.pre(/^find/, function (this: UserModel, next) {
    this.find({ active: { $ne: false } })
    next()
})

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next()

    this.passwordChangedAt = new Date(Date.now() - 5000)
    next()
})

userSchema.methods.correctPassword = async (
    storedPassword: string,
    candidatePassword: string
) => {
    return await Password.compare(storedPassword, candidatePassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimepstamp: number) {
    if (this.passwordChangedAt) {
        const changedTimestamp = this.passwordChangedAt.getTime() / 1000

        return JWTTimepstamp < changedTimestamp
    }
    return false
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = Password.createResetToken()

    this.passwordResetToken = encrypt(resetToken)

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000

    return resetToken
}

userSchema.statics.build = async (attrs: UserAttrs) => {
    return await new User(attrs).save()
}

export const User = mongoose.model<UserDoc, UserModel>('User', userSchema)
