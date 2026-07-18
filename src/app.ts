import 'reflect-metadata'
import express from 'express'
import { usuarioRouter } from './usuario/usuario.routes.js'
import { paisRouter } from './Pais/pais.routes.js'
import { localidadRouter } from './Pais/localidad.routes.js'
import { viajeRouter } from './usuario/viaje.routes.js'
import { orm, syncSchema } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'

const app = express()

app.use(express.json())

// Middleware de MikroORM — contexto por request
app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})

app.use('/api/usuarios', usuarioRouter)
app.use('/api/paises', paisRouter)
app.use('/api/localidades', localidadRouter)
app.use('/api/viajes', viajeRouter)
app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' })
})

// Función de arranque
async function main() {
  try {
    await syncSchema()
    app.listen(3000, () => {
      console.log('Server running on http://localhost:3000/')
    })
  } catch (error) {
    console.error('Error al iniciar el servidor:', error)
    await orm.close(true)
    process.exit(1)
  }
}

main()