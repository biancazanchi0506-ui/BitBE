import { Router } from 'express'
import { sanitizeHospedajeInput, findAll, findOne, add } from './hospedaje.controller.js'

export const hospedajeRouter = Router()

hospedajeRouter.get('/', findAll)
hospedajeRouter.get('/:id', findOne)
hospedajeRouter.post('/', sanitizeHospedajeInput, add)
