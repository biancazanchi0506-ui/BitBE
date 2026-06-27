import { EntitySchema, Collection, Cascade } from '@mikro-orm/core'
import { BaseEntity, BaseEntitySchema } from '../shared/db/baseEntity.entity.js'
// eslint-disable-next-line import/no-cycle
import { Usuario } from './usuario.entity.js'

export class UsuarioClass extends BaseEntity {
  name!: string
  description!: string
  usuarios = new Collection<Usuario>(this)
}

export const UsuarioClassSchema = new EntitySchema<UsuarioClass, BaseEntity>({
  class: UsuarioClass,
  extends: BaseEntitySchema,
  properties: {
    name: { type: 'string', unique: true, nullable: false },
    description: { type: 'string' },
    usuarios: {
      kind: '1:m',
      entity: () => Usuario,
      mappedBy: 'usuarioClass',
      cascade: [Cascade.ALL],
    },
  },
})
