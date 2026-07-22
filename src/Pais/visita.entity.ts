import { Entity } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Lugar } from './lugar.entity.js'

@Entity({ discriminatorValue: 'visita' })
export class Visita extends Lugar {

}