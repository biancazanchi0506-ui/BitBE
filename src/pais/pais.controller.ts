import { Request, Response, NextFunction } from 'express'
import { RequestContext, NotFoundError } from '@mikro-orm/core'
import { Pais } from './pais.entity.js'

function sanitizePaisInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    nombrePais: req.body.nombrePais,
    descripcionPais: req.body.descripcionPais,
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })

  // Validación mínima: nombrePais es obligatorio (nullable: false en la entidad)
  if (
    req.method === 'POST' &&
    (!req.body.sanitizedInput.nombrePais ||
      typeof req.body.sanitizedInput.nombrePais !== 'string')
  ) {
    return res
      .status(400)
      .json({ message: 'nombrePais es obligatorio y debe ser un texto' })
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
    const paises = await em.find(Pais, {})
    res.status(200).json({ message: 'found all paises', data: paises })
  } catch (error: any) {
    res.status(500).json({ message: 'Error al buscar los países' })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = parseId(req, res)
    if (id === null) return

    const em = RequestContext.getEntityManager()!
    const pais = await em.findOneOrFail(Pais, { id })
    res.status(200).json({ message: 'found pais', data: pais })
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: 'País no encontrado' })
    }
    res.status(500).json({ message: 'Error al buscar el país' })
  }
}

async function add(req: Request, res: Response) {
  try {
    const em = RequestContext.getEntityManager()!
    const pais = em.create(Pais, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'pais created', data: pais })
  } catch (error: any) {
    res.status(500).json({ message: 'Error al crear el país' })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = parseId(req, res)
    if (id === null) return

    const em = RequestContext.getEntityManager()!
    const paisToUpdate = await em.findOneOrFail(Pais, { id })
    em.assign(paisToUpdate, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({ message: 'pais updated', data: paisToUpdate })
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: 'País no encontrado' })
    }
    res.status(500).json({ message: 'Error al actualizar el país' })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = parseId(req, res)
    if (id === null) return

    const em = RequestContext.getEntityManager()!
    const pais = await em.findOneOrFail(Pais, { id })
    await em.removeAndFlush(pais)
    res.status(200).json({ message: 'pais deleted' })
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: 'País no encontrado' })
    }
    res.status(500).json({ message: 'Error al eliminar el país' })
  }
}

export { sanitizePaisInput, findAll, findOne, add, update, remove }