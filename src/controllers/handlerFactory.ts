import { Model } from 'mongoose'
import { NotFoundError } from '../errors/NotFound.js'
import { ApiFeatures } from '../helpers/apiFeatures.js'
import { NextFunction, Request, Response } from 'express'

export const deleteOne =
    <ModelDoc>(Model: Model<ModelDoc>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const doc = await Model.findByIdAndDelete(req.params.id)
        if (!doc) {
            throw new NotFoundError('Nothing found with that ID')
        }
        res.status(204).json({ status: 'success' })
    }

export const updateOne =
    <ModelDoc>(Model: Model<ModelDoc>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
        if (!doc) {
            throw new NotFoundError('Nothing found with that ID')
        }
        res.json({ status: 'success', data: { data: doc } })
    }

export const createOne =
    <ModelDoc>(Model: Model<ModelDoc>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const doc = await Model.create(req.body)

        res.status(201).json({ status: 'success', data: { data: doc } })
    }

export const getOne =
    <ModelDoc>(Model: Model<ModelDoc>, populateOptions: { path: string }) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const query = Model.findById(req.params.id)

        if (populateOptions) {
            query.populate(populateOptions)
        }

        const doc = await query
        if (!doc) {
            throw new NotFoundError('Nothing found with that ID')
        }

        res.json({
            status: 'success',
            data: { data: doc },
        })
    }

export const getAll =
    <ModelDoc>(Model: Model<ModelDoc>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const docs = await new ApiFeatures(
            Model.find(),
            req.query
        )
            .sort()
            .limit()
            .paginate()
            .exec()

        res.json({
            status: 'success',
            results: docs.length,
            data: { data: docs },
        })
    }
