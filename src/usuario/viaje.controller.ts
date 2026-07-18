import { Request, Response, NextFunction } from 'express'
import {
  RequestContext,
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core'
import { Viaje } from './viaje.entity.js'

function sanitizeViajeInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    fechaInicio: req.body.fechaInicio,
    fechaFin: req.body.fechaFin,
    creador: req.body.creador,
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })

  // Validación mínima de campos obligatorios (nullable: false en la entidad),
  // solo exigidos en la creación; en PUT/PATCH puede venir un subconjunto.
  if (req.method === 'POST') {
    if (
      !req.body.sanitizedInput.nombre ||
      typeof req.body.sanitizedInput.nombre !== 'string'
    ) {
      return res
        .status(400)
        .json({ message: 'nombre es obligatorio y debe ser un texto' })
    }
    if (!req.body.sanitizedInput.fechaInicio) {
      return res.status(400).json({ message: 'fechaInicio es obligatoria' })
    }
    if (!req.body.sanitizedInput.fechaFin) {
      return res.status(400).json({ message: 'fechaFin es obligatoria' })
    }
    if (!req.body.sanitizedInput.creador) {
      return res.status(400).json({ message: 'creador es obligatorio' })
    }
  }

  // Regla de negocio: fechaFin no puede ser anterior a fechaInicio
  if (
    req.body.sanitizedInput.fechaInicio &&
    req.body.sanitizedInput.fechaFin
  ) {
    const inicio = new Date(req.body.sanitizedInput.fechaInicio)
    const fin = new Date(req.body.sanitizedInput.fechaFin)
    if (fin < inicio) {
      return res
        .status(400)
        .json({ message: 'fechaFin no puede ser anterior a fechaInicio' })
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

async function findAll(req: Request, res: Response) {
  try {
    const em = RequestContext.getEntityManager()!
    const viajes = await em.find(Viaje, {})
    res.status(200).json({ message: 'found all viajes', data: viajes })
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener los viajes' })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = parseId(req, res)
    if (id === null) return

    const em = RequestContext.getEntityManager()!
    const item = await em.findOneOrFail(Viaje, { id })
    res.status(200).json({ message: 'found viaje', data: item })
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: 'Viaje no encontrado' })
    }
    res.status(500).json({ message: 'Error al buscar el viaje' })
  }
}

async function add(req: Request, res: Response) {
  try {
    const em = RequestContext.getEntityManager()!
    const item = em.create(Viaje, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'viaje created', data: item })
  } catch (error: any) {
    if (error instanceof UniqueConstraintViolationException) {
      return res.status(409).json({ message: 'El viaje ya existe' })
    }
    res.status(500).json({ message: 'Error al crear el viaje' })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = parseId(req, res)
    if (id === null) return

    const em = RequestContext.getEntityManager()!
    const item = await em.findOneOrFail(Viaje, { id })
    em.assign(item, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({ message: 'viaje updated', data: item })
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: 'Viaje no encontrado' })
    }
    if (error instanceof UniqueConstraintViolationException) {
      return res.status(409).json({ message: 'El viaje ya existe' })
    }
    res.status(500).json({ message: 'Error al actualizar el viaje' })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = parseId(req, res)
    if (id === null) return

    const em = RequestContext.getEntityManager()!
    const item = await em.findOneOrFail(Viaje, { id })
    await em.removeAndFlush(item)
    res.status(200).json({ message: 'viaje deleted' })
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: 'Viaje no encontrado' })
    }
    res.status(500).json({ message: 'Error al eliminar el viaje' })
  }
}

export { sanitizeViajeInput, findAll, findOne, add, update, remove }