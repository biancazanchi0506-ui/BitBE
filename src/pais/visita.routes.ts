import { Router } from 'express'
import { sanitizeVisitaInput, findAll, findOne, add, update, remove } from './visita.controller.js'

export const visitaRouter = Router()

visitaRouter.get('/', findAll)
visitaRouter.get('/:id', findOne)
visitaRouter.post('/', sanitizeVisitaInput, add)
visitaRouter.put('/:id', sanitizeVisitaInput, update)
visitaRouter.patch('/:id', sanitizeVisitaInput, update)
visitaRouter.delete('/:id', remove)
