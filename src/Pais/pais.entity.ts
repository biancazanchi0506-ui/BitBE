import { Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class Pais extends BaseEntity {
  @Property({ length: 100, nullable: false })
  nombrePais!: string

  @Property({ type: 'text', nullable: true })
  descripcionPais?: string
}
