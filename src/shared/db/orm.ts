import { MikroORM } from '@mikro-orm/core'
import { MySqlDriver } from '@mikro-orm/mysql'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import 'dotenv/config'

const DB_URL = process.env.DB_URL
if (!DB_URL) {
  throw new Error('Falta definir DB_URL en el archivo .env')
}

export const orm = await MikroORM.init({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: 'bitacora',
  driver: MySqlDriver,
  clientUrl: DB_URL,
  highlighter: new SqlHighlighter(),
  debug: true,
  schemaGenerator: {
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
})

export const syncSchema = async () => {
  await orm.schema.update()
}