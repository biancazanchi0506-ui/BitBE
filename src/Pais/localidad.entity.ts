import { Entity, Property, ManyToOne, Rel, Collection, OneToMany } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Pais } from './pais.entity.js'
import { Lugar } from './lugar.entity.js'

@Entity()
export class Localidad extends BaseEntity {
  @Property({ length: 100, nullable: false })
  nombreLocalidad!: string

  @Property({ type: 'text', nullable: true })
  descripcionLocalidad?: string

  @ManyToOne(() => Pais, { nullable: false })
  pais!: Rel<Pais>

  @OneToMany(() => Lugar, (lugar) => lugar.localidad)
  lugares = new Collection<Lugar>(this)
}
