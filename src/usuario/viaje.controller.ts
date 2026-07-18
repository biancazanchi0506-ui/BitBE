import { Request, Response } from 'express'
import { RequestContext } from '@mikro-orm/core'
import { NotFoundError } from '@mikro-orm/core'
import { UniqueConstraintViolationException } from '@mikro-orm/core'
import { Viaje } from './viaje.entity.js'

function parseId(req: Request): number {
  const id = Number.parseInt(req.params.id as string)
  if (Number.isNaN(id)) {
    throw new Error('INVALID_ID')
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
    const em = RequestContext.getEntityManager()!
    const id = parseId(req)
    const item = await em.findOneOrFail(Viaje, { id })
    res.status(200).json({ message: 'found viaje', data: item })
  } catch (error: any) {
    if (error.message === 'INVALID_ID') {
      return res.status(400).json({ message: 'Id inválido' })
    }
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: 'Viaje no encontrado' })
    }
    res.status(500).json({ message: 'Error al buscar el viaje' })
  }
}

async function add(req: Request, res: Response) {
  try {
    const em = RequestContext.getEntityManager()!
    const item = em.create(Viaje, req.body)
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
    const em = RequestContext.getEntityManager()!
    const id = parseId(req)
    const item = await em.findOneOrFail(Viaje, { id })
    em.assign(item, req.body)
    await em.flush()
    res.status(200).json({ message: 'viaje updated', data: item })
  } catch (error: any) {
    if (error.message === 'INVALID_ID') {
      return res.status(400).json({ message: 'Id inválido' })
    }
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: 'Viaje no encontrado' })
    }
    res.status(500).json({ message: 'Error al actualizar el viaje' })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const em = RequestContext.getEntityManager()!
    const id = parseId(req)
    const item = await em.findOneOrFail(Viaje, { id })
    await em.removeAndFlush(item)
    res.status(200).json({ message: 'viaje deleted' })
  } catch (error: any) {
    if (error.message === 'INVALID_ID') {
      return res.status(400).json({ message: 'Id inválido' })
    }
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: 'Viaje no encontrado' })
    }
    res.status(500).json({ message: 'Error al eliminar el viaje' })
  }
}

export { findAll, findOne, add, update, remove }