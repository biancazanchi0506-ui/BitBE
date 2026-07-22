import { Request, Response, NextFunction } from 'express'
import { RequestContext, NotFoundError } from '@mikro-orm/core'
import { Hospedaje } from './hospedaje.entity.js'

function sanitizeHospedajeInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    nombreHospedaje: req.body.nombreHospedaje,
    descripcionHospedaje: req.body.descripcionHospedaje,
    pais: req.body.pais,
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })

  // Validación mínima: nombreLocalidad y pais son obligatorios (nullable: false en la entidad)
  if (
    req.method === 'POST' &&
    (!req.body.sanitizedInput.nombreLocalidad ||
      typeof req.body.sanitizedInput.nombreLocalidad !== 'string')
  ) {
    return res
      .status(400)
      .json({ message: 'nombreLocalidad es obligatorio y debe ser un texto' })
  }

  if (req.method === 'POST' && !req.body.sanitizedInput.pais) {
    return res.status(400).json({ message: 'pais es obligatorio' })
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
    const localidades = await em.find(Localidad, {})
    res.status(200).json({ message: 'found all localidades', data: localidades })
  } catch (error: any) {
    res.status(500).json({ message: 'Error al buscar las localidades' })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = parseId(req, res)
    if (id === null) return

    const em = RequestContext.getEntityManager()!
    const localidad = await em.findOneOrFail(Localidad, { id })
    res.status(200).json({ message: 'found localidad', data: localidad })
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: 'Localidad no encontrada' })
    }
    res.status(500).json({ message: 'Error al buscar la localidad' })
  }
}

async function add(req: Request, res: Response) {
  try {
    const em = RequestContext.getEntityManager()!
    const localidad = em.create(Localidad, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'localidad created', data: localidad })
  } catch (error: any) {
    res.status(500).json({ message: 'Error al crear la localidad' })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = parseId(req, res)
    if (id === null) return

    const em = RequestContext.getEntityManager()!
    const localidadToUpdate = await em.findOneOrFail(Localidad, { id })
    em.assign(localidadToUpdate, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({ message: 'localidad updated', data: localidadToUpdate })
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: 'Localidad no encontrada' })
    }
    res.status(500).json({ message: 'Error al actualizar la localidad' })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = parseId(req, res)
    if (id === null) return

    const em = RequestContext.getEntityManager()!
    const localidad = await em.findOneOrFail(Localidad, { id })
    await em.removeAndFlush(localidad)
    res.status(200).json({ message: 'localidad deleted' })
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: 'Localidad no encontrada' })
    }
    res.status(500).json({ message: 'Error al eliminar la localidad' })
  }
}

export { sanitizeLocalidadInput, findAll, findOne, add, update, remove }
