import { Router } from 'express'
import {
  sanitizeUsuarioInput,
  validateUsuarioInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from './usuario.controller.js'

export const usuarioRouter = Router()

usuarioRouter.get('/', findAll)
usuarioRouter.get('/:id', findOne)
usuarioRouter.post('/', sanitizeUsuarioInput, validateUsuarioInput, add)
usuarioRouter.put('/:id', sanitizeUsuarioInput, validateUsuarioInput, update)
usuarioRouter.patch('/:id', sanitizeUsuarioInput, validateUsuarioInput, update)
usuarioRouter.delete('/:id', remove)
