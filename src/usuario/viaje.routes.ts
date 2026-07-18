import { Router } from 'express'
import { sanitizeViajeInput, findAll, findOne, add, update, remove } from './viaje.controller.js'

export const viajeRouter = Router()

viajeRouter.get('/', findAll)
viajeRouter.get('/:id', findOne)
viajeRouter.post('/', sanitizeViajeInput, add)
viajeRouter.put('/:id', sanitizeViajeInput, update)
viajeRouter.patch('/:id', sanitizeViajeInput, update)
viajeRouter.delete('/:id', remove)