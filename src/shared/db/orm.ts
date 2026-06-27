import {MikroORM} from "@mikro-orm/core";
import {SglHighLighter} from "@mikro-orm/sql-highlighter";

export const orm = await MikroORM.init({
  entities : ['./dist/shared/db/entities'], 
  entitiesTs : ['./src/shared/db/entities'],
  dbName : 'bitacora',
  type : 'mysql',
  clientUrl : 'mysql://root:root@localhost:3306/bitacora',
  highlighter : new SglHighLighter(),
  debug : true,
  shemaGenerator : {
    disableForeignKeys : true,
    createForeignKeyConstraints : true,
    ignoreSchema : [],
  },
});
export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator()
  /*   
  await generator.dropSchema()
  await generator.createSchema()
  */
  await generator.updateSchema()
}