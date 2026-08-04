import { Entity, Property, ManyToOne, Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Usuario } from '../usuario/usuario.entity.js'
import { Lugar } from '../pais/lugar.entity.js'

@Entity()
export class Resena extends BaseEntity {
  @Property({ type: 'date', nullable: false })
  fechaResena: Date = new Date()

  @Property({ type: 'int', nullable: false })
  puntaje!: number

  @Property({ type: 'text', nullable: true })
  comentario?: string

  @ManyToOne(() => Usuario, { nullable: false })
  usuario!: Rel<Usuario>

  @ManyToOne(() => Lugar, { nullable: false })
  lugar!: Rel<Lugar>
}
