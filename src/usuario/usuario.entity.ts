import { EntitySchema } from '@mikro-orm/core'
import { BaseEntity, BaseEntitySchema } from '../shared/db/baseEntity.entity.js'

export class Usuario extends BaseEntity {
  nombre!: string
  apellido!: string
  fechaNacimiento!: Date
  biografia?: string
  mail!: string
  telefono?: string
}

export const UsuarioSchema = new EntitySchema<Usuario, BaseEntity>({
  class: Usuario,
  extends: BaseEntitySchema,
  properties: {
    nombre: { type: 'string', nullable: false },
    apellido: { type: 'string', nullable: false },
    fechaNacimiento: { type: Date, nullable: false },
    biografia: { type: 'text', nullable: true },
    mail: { type: 'string', unique: true, nullable: false },
    telefono: { type: 'string', nullable: true },
  },
})
