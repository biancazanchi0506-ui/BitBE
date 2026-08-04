import { Router } from 'express'
import { sanitizeResenaInput, findAll, findOne, add, update, remove } from './resena.controller.js'

export const resenaRouter = Router()

resenaRouter.get('/', findAll)
resenaRouter.get('/:id', findOne)
resenaRouter.post('/', sanitizeResenaInput, add)
resenaRouter.put('/:id', sanitizeResenaInput, update)
resenaRouter.patch('/:id', sanitizeResenaInput, update)
resenaRouter.delete('/:id', remove)
