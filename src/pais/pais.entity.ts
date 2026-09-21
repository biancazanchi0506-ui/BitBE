import { Entity, Property, ManyToMany, Collection } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Viaje } from '../usuario/viaje.entity.js'

@Entity()
export class Pais extends BaseEntity {
  @Property({ length: 100, nullable: false })
  nombrePais!: string

  @Property({ type: 'text', nullable: true })
  descripcionPais?: string

  @ManyToMany(() => Viaje, (viaje) => viaje.paises)
  viajes = new Collection<Viaje>(this)
}
