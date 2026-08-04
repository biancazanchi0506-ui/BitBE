import { Entity, Property, ManyToOne, ManyToMany, Collection, Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Usuario } from './usuario.entity.js'
import { Lugar } from '../pais/lugar.entity.js'
import { Pais } from '../pais/pais.entity.js'

@Entity()
export class Viaje extends BaseEntity {

  @Property()
  nombre!: string

  @Property({ type: 'text', nullable: true })
  descripcion?: string

  @Property()
  fechaInicio!: Date

  @Property()
  fechaFin!: Date

  @ManyToOne(() => Usuario)
  creador!: Rel<Usuario>

  @ManyToMany(() => Usuario)
  participantes = new Collection<Usuario>(this)

  @ManyToMany(() => Lugar)
  lugares = new Collection<Lugar>(this)

  @ManyToMany(() => Pais)
  paises = new Collection<Pais>(this)
}