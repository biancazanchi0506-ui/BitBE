import { Entity } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Lugar } from './lugar.entity.js'

@Entity({ discriminatorValue: 'hospedaje' })
export class Hospedaje extends Lugar {
}