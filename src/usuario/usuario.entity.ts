import { Entity, Property, OneToMany, ManyToMany, Collection, Cascade, Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Viaje } from '../viaje/viaje.entity.js'

@Entity()
export class Usuario extends BaseEntity {
  @Property({ nullable: false, unique: true })
  username!: string

  @Property({ length: 100, nullable: false })
  nombre!: string

  @Property({ length: 100, nullable: false })
  apellido!: string

  @Property({ type: 'date', nullable: true })
  fechaNac?: Date

  @Property({ type: 'text', nullable: true })
  biografia?: string

  @Property({ length: 150, nullable: false, unique: true })
  email!: string

  @Property({ length: 255, nullable: false })
  password!: string

  @Property({ length: 50, nullable: true })
  telefono?: string

  @OneToMany(() => Viaje, (viaje) => viaje.creador, {
  cascade: [Cascade.ALL],
  })
  viajesCreados = new Collection<Viaje>(this)

  @ManyToMany(() => Viaje, (viaje) => viaje.participantes)
  viajesParticipados = new Collection<Viaje>(this)
}
