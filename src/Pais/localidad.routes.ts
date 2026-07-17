import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './viaje.controller.js'

export const viajeRouter = Router()

viajeRouter.get('/', findAll)
viajeRouter.get('/:id', findOne)
viajeRouter.post('/', add)
viajeRouter.put('/:id', update)
viajeRouter.delete('/:id', remove)