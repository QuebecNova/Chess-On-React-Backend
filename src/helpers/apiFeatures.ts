import { Request } from 'express'
import { QueryWithHelpers } from 'mongoose'

export class ApiFeatures<ModelDoc> {
    query: QueryWithHelpers<Array<ModelDoc>, ModelDoc, {}, {}, 'find'>
    queryInitial: Request['query']
    constructor(
        query: QueryWithHelpers<Array<ModelDoc>, ModelDoc, {}, {}, 'find'>,
        queryInitial: Request['query']
    ) {
        this.query = query
        this.queryInitial = queryInitial
        this.filter()
    }

    filter() {
        const query = { ...this.queryInitial }
        const exclude = ['page', 'sort', 'limit', 'fields']

        exclude.forEach((field) => delete query[field])

        const queryStr = JSON.stringify(query).replace(
            /\b(gte|lte|lt|gt)\b/g,
            (match) => `$${match}`
        )

        this.query.find(JSON.parse(queryStr))

        return this
    }

    sort() {
        if (
            this.queryInitial.sort &&
            typeof this.queryInitial.sort === 'string'
        ) {
            this.query = this.query.sort(
                this.queryInitial.sort.split(',').join(' ')
            )
        } else {
            this.query.sort('-price')
        }
        return this
    }

    limit() {
        if (
            this.queryInitial.fields &&
            typeof this.queryInitial.fields === 'string'
        ) {
            this.query = this.query.select(
                this.queryInitial.fields.split(',').join(' ')
            )
        } else {
            this.query = this.query.select('-__v')
        }
        return this
    }

    paginate() {
        const page = parseInt(this.queryInitial.page as string) || 1
        const limit = parseInt(this.queryInitial.limit as string) || 10
        const skip = (page - 1) * limit

        this.query = this.query.skip(skip).limit(limit)

        return this
    }

    async exec() {
        return await this.query
    }
}
