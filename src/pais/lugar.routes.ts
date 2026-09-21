import { Router } from 'express'
import { findAll, findOne } from './lugar.controller.js'

export const lugarRouter = Router()

// Solo lectura: la creación/edición/borrado se hace vía /api/hospedajes o /api/visitas,
// que son los subtipos concretos de la jerarquía ISA.
lugarRouter.get('/', findAll)
lugarRouter.get('/:id', findOne)