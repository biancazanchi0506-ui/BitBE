import { Router } from 'express'
import { sanitizeHospedajeInput, findAll, findOne, add, update, remove } from './hospedaje.controller.js'

export const hospedajeRouter = Router()

hospedajeRouter.get('/', findAll)
hospedajeRouter.get('/:id', findOne)
hospedajeRouter.post('/', sanitizeHospedajeInput, add)
hospedajeRouter.put('/:id', sanitizeHospedajeInput, update)
hospedajeRouter.patch('/:id', sanitizeHospedajeInput, update)
hospedajeRouter.delete('/:id', remove)
