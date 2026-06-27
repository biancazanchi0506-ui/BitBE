import {MikroORM} from "@mikro-orm/core";
import {SglHighLighter} from "@mikro-orm/sql-highlighter";

export const orm = await MikroORM.init({
  entities : ['./dist/shared/db/entities'], 
  entitiesTs : ['./src/shared/db/entities'],