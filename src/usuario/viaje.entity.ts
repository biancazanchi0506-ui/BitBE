import { Entity, Property, ManyToOne, ManyToMany, Collection, Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Usuario } from './usuario.entity.js'

@Entity()
export class Viaje extends BaseEntity {

  @Property()
  nombre!: string

  @Property()
  fechaInicio!: Date

  @Property()
  fechaFin!: Date

  @ManyToOne(() => Usuario)
  creador!: Rel<Usuario>

  @ManyToMany(() => Usuario)
  participantes = new Collection<Usuario>(this)
}