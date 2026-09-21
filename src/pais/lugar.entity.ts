import { Entity, Property, ManyToOne, ManyToMany, Collection, Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Localidad } from './localidad.entity.js'
import { Viaje } from '../usuario/viaje.entity.js'


@Entity({
  discriminatorColumn: 'tipo',
  discriminatorMap: { hospedaje: 'Hospedaje', visita: 'Visita' },
})
export abstract class Lugar extends BaseEntity {
  @Property({ length: 100, nullable: false })
  nombre!: string

  @Property({ type: 'text', nullable: true })
  descripcion?: string

  @Property({ type: 'int', nullable: true })
  altura?: number

  @Property({ length: 150, nullable: true })
  calle?: string

  @Property({ type: 'decimal', precision: 10, scale: 7})
  latitud!: number

  @Property({ type: 'decimal', precision: 10, scale: 7})
  longitud!: number

  @ManyToOne(() => Localidad, { nullable: false })
  localidad!: Rel<Localidad>

  @ManyToMany(() => Viaje, (viaje) => viaje.lugares)
  viajes = new Collection<Viaje>(this)
}