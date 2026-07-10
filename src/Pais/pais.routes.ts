import { Router } from 'express'
import { sanitizePaisInput, findAll, findOne, add, update, remove } from './pais.controller.js'

export const paisRouter = Router()

paisRouter.get('/', findAll)
paisRouter.get('/:id', findOne)
paisRouter.post('/', sanitizePaisInput, add)
paisRouter.put('/:id', sanitizePaisInput, update)
paisRouter.patch('/:id', sanitizePaisInput, update)
paisRouter.delete('/:id', remove)
