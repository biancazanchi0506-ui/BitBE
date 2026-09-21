import { Request, Response, NextFunction } from 'express'
import { RequestContext, NotFoundError } from '@mikro-orm/core'
import { Visita } from './visita.entity.js'

function sanitizeVisitaInput(
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
    const visitas = await em.find(Visita, filtro)
    res.status(200).json({ message: 'found all visitas', data: visitas })
  } catch (error: any) {
    res.status(500).json({ message: 'Error al buscar las visitas' })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = parseId(req, res)
    if (id === null) return

    const em = RequestContext.getEntityManager()!
    const visita = await em.findOneOrFail(Visita, { id })
    res.status(200).json({ message: 'found visita', data: visita })
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: 'Visita no encontrada' })
    }
    res.status(500).json({ message: 'Error al buscar la visita' })
  }
}

async function add(req: Request, res: Response) {
  try {
    const em = RequestContext.getEntityManager()!
    const visita = em.create(Visita, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'visita created', data: visita })
  } catch (error: any) {
    res.status(500).json({ message: 'Error al crear la visita' })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = parseId(req, res)
    if (id === null) return

    const em = RequestContext.getEntityManager()!
    const visitaToUpdate = await em.findOneOrFail(Visita, { id })
    em.assign(visitaToUpdate, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({ message: 'visita updated', data: visitaToUpdate })
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: 'Visita no encontrada' })
    }
    res.status(500).json({ message: 'Error al actualizar la visita' })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = parseId(req, res)
    if (id === null) return

    const em = RequestContext.getEntityManager()!
    const visita = await em.findOneOrFail(Visita, { id })
    await em.removeAndFlush(visita)
    res.status(200).json({ message: 'visita deleted' })
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: 'Visita no encontrada' })
    }
    res.status(500).json({ message: 'Error al eliminar la visita' })
  }
}

export { sanitizeVisitaInput, findAll, findOne, add, update, remove }
