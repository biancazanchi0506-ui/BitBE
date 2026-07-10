import { Request, Response, NextFunction } from 'express'
import {
  RequestContext,
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core'
import { Usuario } from './usuario.entity.js'

function sanitizeUsuarioInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    username: req.body.username,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    fechaNac: req.body.fechaNac,
    biografia: req.body.biografia,
    email: req.body.email,
    password: req.body.password,
    telefono: req.body.telefono,
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })

  // Validación mínima de campos obligatorios (nullable: false en la entidad),
  // solo exigidos en la creación; en PUT/PATCH puede venir un subconjunto.
  if (req.method === 'POST') {
    const requeridos = ['username', 'nombre', 'apellido', 'email', 'password']
    const faltantes = requeridos.filter(
      (campo) => !req.body.sanitizedInput[campo]
    )
    if (faltantes.length > 0) {
      return res.status(400).json({
        message: `Faltan campos obligatorios: ${faltantes.join(', ')}`,
      })
    }
  }

  next()
}

function parseId(req: Request, res: Response): number | null {
  const id = Number.parseInt(req.params.id as string)
  if (Number.isNaN(id)) {
    res.status(400).json({ message: 'El id debe ser un número válido' })
    return null
  }
  return id
}

// Nunca devolver el password en las respuestas, ni siquiera hasheado
function toSafeUsuario(usuario: Usuario) {
  const { password, ...safeUsuario } = usuario
  return safeUsuario
}

async function findAll(req: Request, res: Response) {
  try {
    const em = RequestContext.getEntityManager()!
    const usuarios = await em.find(Usuario, {})
    res.status(200).json({
      message: 'found all usuarios',
      data: usuarios.map(toSafeUsuario),
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Error al buscar los usuarios' })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = parseId(req, res)
    if (id === null) return

    const em = RequestContext.getEntityManager()!
    const usuario = await em.findOneOrFail(Usuario, { id })
    res.status(200).json({ message: 'found usuario', data: toSafeUsuario(usuario) })
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    res.status(500).json({ message: 'Error al buscar el usuario' })
  }
}

async function add(req: Request, res: Response) {
  try {
    const em = RequestContext.getEntityManager()!
    const usuario = em.create(Usuario, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'usuario created', data: toSafeUsuario(usuario) })
  } catch (error: any) {
    if (error instanceof UniqueConstraintViolationException) {
      return res
        .status(409)
        .json({ message: 'El username o el email ya están en uso' })
    }
    res.status(500).json({ message: 'Error al crear el usuario' })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = parseId(req, res)
    if (id === null) return

    const em = RequestContext.getEntityManager()!
    const usuarioToUpdate = await em.findOneOrFail(Usuario, { id })
    em.assign(usuarioToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'usuario updated', data: toSafeUsuario(usuarioToUpdate) })
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    if (error instanceof UniqueConstraintViolationException) {
      return res
        .status(409)
        .json({ message: 'El username o el email ya están en uso' })
    }
    res.status(500).json({ message: 'Error al actualizar el usuario' })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = parseId(req, res)
    if (id === null) return

    const em = RequestContext.getEntityManager()!
    const usuario = await em.findOneOrFail(Usuario, { id })
    await em.removeAndFlush(usuario)
    res.status(200).json({ message: 'usuario deleted' })
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    res.status(500).json({ message: 'Error al eliminar el usuario' })
  }
}

export { sanitizeUsuarioInput, findAll, findOne, add, update, remove }