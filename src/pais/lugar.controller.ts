import { Request, Response } from 'express'
import { RequestContext, NotFoundError } from '@mikro-orm/core'
import { Lugar } from './lugar.entity.js'

// Lugar es la superclase ISA de Hospedaje y Visita (herencia por tabla única,
// discriminada por la columna "tipo"). No se instancia directamente: alta,
// modificación y baja se hacen a través de /api/hospedajes o /api/visitas,
// donde MikroORM sabe qué subtipo concreto crear. Este controller expone
// únicamente lectura polimórfica (todos los lugares, sin importar el subtipo).

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
    const lugares = await em.find(Lugar, filtro)
    res.status(200).json({ message: 'found all lugares', data: lugares })
  } catch (error: any) {
    res.status(500).json({ message: 'Error al buscar los lugares' })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = parseId(req, res)
    if (id === null) return

    const em = RequestContext.getEntityManager()!
    const lugar = await em.findOneOrFail(Lugar, { id })
    res.status(200).json({ message: 'found lugar', data: lugar })
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: 'Lugar no encontrado' })
    }
    res.status(500).json({ message: 'Error al buscar el lugar' })
  }
}

export { findAll, findOne }