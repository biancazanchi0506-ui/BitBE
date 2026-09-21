import { Request, Response, NextFunction } from 'express'
import { RequestContext, NotFoundError } from '@mikro-orm/core'
import { Hospedaje } from './hospedaje.entity.js'

function sanitizeHospedajeInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    altura: req.body.altura,
    calle: req.body.calle,
    latitud: req.body.latitud,
    longitud: req.body.longitud,
    localidad: req.body.localidad,
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })

  // Validación mínima: nombre, latitud, longitud y localidad son obligatorios (nullable: false en la entidad)
  if (
    req.method === 'POST' &&
    (!req.body.sanitizedInput.nombre ||
      typeof req.body.sanitizedInput.nombre !== 'string')
  ) {
    return res
      .status(400)
      .json({ message: 'nombre es obligatorio y debe ser un texto' })
  }

  if (
    req.method === 'POST' &&
    (req.body.sanitizedInput.latitud === undefined ||
      req.body.sanitizedInput.longitud === undefined)
  ) {
    return res
      .status(400)
      .json({ message: 'latitud y longitud son obligatorias' })
  }

  if (req.method === 'POST' && !req.body.sanitizedInput.localidad) {
    return res.status(400).json({ message: 'localidad es obligatoria' })
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
    const filtro: any = {}
    if (req.query.localidad) {
      filtro.localidad = Number(req.query.localidad)
    }
    const hospedajes = await em.find(Hospedaje, filtro)
    res.status(200).json({ message: 'found all hospedajes', data: hospedajes })
  } catch (error: any) {
    res.status(500).json({ message: 'Error al buscar los hospedajes' })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = parseId(req, res)
    if (id === null) return

    const em = RequestContext.getEntityManager()!
    const hospedaje = await em.findOneOrFail(Hospedaje, { id })
    res.status(200).json({ message: 'found hospedaje', data: hospedaje })
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: 'Hospedaje no encontrado' })
    }
    res.status(500).json({ message: 'Error al buscar el hospedaje' })
  }
}

async function add(req: Request, res: Response) {
  try {
    const em = RequestContext.getEntityManager()!
    const hospedaje = em.create(Hospedaje, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'hospedaje created', data: hospedaje })
  } catch (error: any) {
    res.status(500).json({ message: 'Error al crear el hospedaje' })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = parseId(req, res)
    if (id === null) return

    const em = RequestContext.getEntityManager()!
    const hospedajeToUpdate = await em.findOneOrFail(Hospedaje, { id })
    em.assign(hospedajeToUpdate, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({ message: 'hospedaje updated', data: hospedajeToUpdate })
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: 'Hospedaje no encontrado' })
    }
    res.status(500).json({ message: 'Error al actualizar el hospedaje' })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = parseId(req, res)
    if (id === null) return

    const em = RequestContext.getEntityManager()!
    const hospedaje = await em.findOneOrFail(Hospedaje, { id })
    await em.removeAndFlush(hospedaje)
    res.status(200).json({ message: 'hospedaje deleted' })
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: 'Hospedaje no encontrado' })
    }
    res.status(500).json({ message: 'Error al eliminar el hospedaje' })
  }
}

export { sanitizeHospedajeInput, findAll, findOne, add, update, remove }
