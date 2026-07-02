import { Request, Response, NextFunction } from 'express'
import { NotFoundError, UniqueConstraintViolationException } from '@mikro-orm/core'
import { Usuario } from './usuario.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function sanitizeUsuarioInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    fechaNacimiento: req.body.fechaNacimiento,
    biografia: req.body.biografia,
    mail: req.body.mail,
    telefono: req.body.telefono,
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })

  next()
}

function validateUsuarioInput(req: Request, res: Response, next: NextFunction) {
  const input = req.body.sanitizedInput
  const isCreate = req.method === 'POST'
  const errors: string[] = []

  if (isCreate || input.nombre !== undefined) {
    if (typeof input.nombre !== 'string' || input.nombre.trim().length === 0) {
      errors.push('nombre es requerido y debe ser una cadena no vacía')
    }
  }

  if (isCreate || input.apellido !== undefined) {
    if (typeof input.apellido !== 'string' || input.apellido.trim().length === 0) {
      errors.push('apellido es requerido y debe ser una cadena no vacía')
    }
  }

  if (isCreate || input.fechaNacimiento !== undefined) {
    const fecha = new Date(input.fechaNacimiento)
    if (Number.isNaN(fecha.getTime())) {
      errors.push('fechaNacimiento debe ser una fecha válida')
    } else {
      input.fechaNacimiento = fecha
    }
  }

  if (isCreate || input.mail !== undefined) {
    if (typeof input.mail !== 'string' || !EMAIL_REGEX.test(input.mail)) {
      errors.push('mail debe ser una dirección de correo válida')
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Datos inválidos', errors })
  }

  next()
}

function parseId(req: Request, res: Response): number | undefined {
  const id = Number.parseInt(req.params.id)
  if (Number.isNaN(id)) {
    res.status(400).json({ message: 'El id debe ser un número' })
    return undefined
  }
  return id
}

function handleError(error: unknown, res: Response) {
  if (error instanceof NotFoundError) {
    return res.status(404).json({ message: 'Usuario no encontrado' })
  }
  if (error instanceof UniqueConstraintViolationException) {
    return res.status(400).json({ message: 'Ya existe un usuario con ese mail' })
  }
  const message = error instanceof Error ? error.message : 'Error inesperado'
  return res.status(500).json({ message })
}

async function findAll(req: Request, res: Response) {
  try {
    const usuarios = await em.find(Usuario, {})
    res.status(200).json({ message: 'Usuarios encontrados', data: usuarios })
  } catch (error) {
    handleError(error, res)
  }
}

async function findOne(req: Request, res: Response) {
  const id = parseId(req, res)
  if (id === undefined) return

  try {
    const usuario = await em.findOneOrFail(Usuario, { id })
    res.status(200).json({ message: 'Usuario encontrado', data: usuario })
  } catch (error) {
    handleError(error, res)
  }
}

async function add(req: Request, res: Response) {
  try {
    const usuario = em.create(Usuario, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'Usuario creado', data: usuario })
  } catch (error) {
    handleError(error, res)
  }
}

async function update(req: Request, res: Response) {
  const id = parseId(req, res)
  if (id === undefined) return

  try {
    const usuarioToUpdate = await em.findOneOrFail(Usuario, { id })
    em.assign(usuarioToUpdate, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({ message: 'Usuario actualizado', data: usuarioToUpdate })
  } catch (error) {
    handleError(error, res)
  }
}

async function remove(req: Request, res: Response) {
  const id = parseId(req, res)
  if (id === undefined) return

  try {
    const usuario = await em.findOneOrFail(Usuario, { id })
    await em.removeAndFlush(usuario)
    res.status(200).json({ message: 'Usuario eliminado' })
  } catch (error) {
    handleError(error, res)
  }
}

export {
  sanitizeUsuarioInput,
  validateUsuarioInput,
  findAll,
  findOne,
  add,
  update,
  remove,
}
