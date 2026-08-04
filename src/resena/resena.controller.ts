import { Request, Response, NextFunction } from 'express'
import { RequestContext, NotFoundError } from '@mikro-orm/core'
import { Resena } from './resena.entity.js'

function sanitizeResenaInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    fechaResena: req.body.fechaResena,
    puntaje: req.body.puntaje,
    comentario: req.body.comentario,
    usuario: req.body.usuario,
    lugar: req.body.lugar,
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })

  // Validación mínima de campos obligatorios (nullable: false en la entidad),
  // solo exigidos en la creación; en PUT/PATCH puede venir un subconjunto.
  if (req.method === 'POST') {
    if (!req.body.sanitizedInput.usuario) {
      return res.status(400).json({ message: 'usuario es obligatorio' })
    }
    if (!req.body.sanitizedInput.lugar) {
      return res.status(400).json({ message: 'lugar es obligatorio' })
    }
    if (req.body.sanitizedInput.puntaje === undefined) {
      return res.status(400).json({ message: 'puntaje es obligatorio' })
    }
  }

  // Regla de negocio: puntaje debe ser un entero entre 0 y 5
  if (req.body.sanitizedInput.puntaje !== undefined) {
    const puntaje = Number(req.body.sanitizedInput.puntaje)
    if (!Number.isInteger(puntaje) || puntaje < 0 || puntaje > 5) {
      return res
        .status(400)
        .json({ message: 'puntaje debe ser un entero entre 0 y 5' })
    }
    req.body.sanitizedInput.puntaje = puntaje
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
    if (req.query.lugar) {
      filtro.lugar = Number(req.query.lugar)
    }
    if (req.query.fecha) {
      const fechaStr = req.query.fecha as string
      if (Number.isNaN(new Date(fechaStr).getTime())) {
        return res.status(400).json({ message: 'fecha inválida' })
      }
      // Se filtra con el string tal cual (formato YYYY-MM-DD), igual que como
      // se persiste: convertir a Date acá desplaza el día por la zona horaria local.
      filtro.fechaResena = fechaStr
    }
    const resenas = await em.find(Resena, filtro)
    res.status(200).json({ message: 'found all resenas', data: resenas })
  } catch (error: any) {
    res.status(500).json({ message: 'Error al buscar las reseñas' })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = parseId(req, res)
    if (id === null) return

    const em = RequestContext.getEntityManager()!
    const resena = await em.findOneOrFail(Resena, { id })
    res.status(200).json({ message: 'found resena', data: resena })
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: 'Reseña no encontrada' })
    }
    res.status(500).json({ message: 'Error al buscar la reseña' })
  }
}

async function add(req: Request, res: Response) {
  try {
    const em = RequestContext.getEntityManager()!
    const resena = em.create(Resena, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'resena created', data: resena })
  } catch (error: any) {
    res.status(500).json({ message: 'Error al crear la reseña' })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = parseId(req, res)
    if (id === null) return

    const em = RequestContext.getEntityManager()!
    const resenaToUpdate = await em.findOneOrFail(Resena, { id })
    em.assign(resenaToUpdate, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({ message: 'resena updated', data: resenaToUpdate })
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: 'Reseña no encontrada' })
    }
    res.status(500).json({ message: 'Error al actualizar la reseña' })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = parseId(req, res)
    if (id === null) return

    const em = RequestContext.getEntityManager()!
    const resena = await em.findOneOrFail(Resena, { id })
    await em.removeAndFlush(resena)
    res.status(200).json({ message: 'resena deleted' })
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: 'Reseña no encontrada' })
    }
    res.status(500).json({ message: 'Error al eliminar la reseña' })
  }
}

export { sanitizeResenaInput, findAll, findOne, add, update, remove }
