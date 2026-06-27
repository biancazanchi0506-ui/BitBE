import { EntitySchema } from '@mikro-orm/core'

export abstract class BaseEntity {
  id!: number
  createdAt: Date = new Date()
  updatedAt: Date = new Date()
}

export const BaseEntitySchema = new EntitySchema<BaseEntity>({
  class: BaseEntity,
  abstract: true,
  properties: {
    id: { type: 'number', primary: true, autoincrement: true },
    createdAt: { type: Date },
    updatedAt: { type: Date, onUpdate: () => new Date() },
  },
})
