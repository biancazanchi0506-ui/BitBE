// eslint-disable-next-line import/no-cycle
import { EntitySchema } from '@mikro-orm/core'
import { BaseEntity, BaseEntitySchema } from '../shared/db/baseEntity.entity.js'
import { UsuarioClass } from './usuarioClass.entity.js'

export class Usuario extends BaseEntity {
  username!: string
  email!: string
  password!: string
  usuarioClass?: UsuarioClass
}

export const UsuarioSchema = new EntitySchema<Usuario, BaseEntity>({
  class: Usuario,
  extends: BaseEntitySchema,
  properties: {
    username: { type: 'string', unique: true, nullable: false },
    email: { type: 'string', unique: true, nullable: false },
    password: { type: 'string', nullable: false },
    usuarioClass: { kind: 'm:1', entity: () => UsuarioClass, nullable: true },
  },
})
