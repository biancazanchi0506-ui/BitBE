import express from 'express';
import { RequestContext } from '@mikro-orm/core';
import { orm } from './shared/db/orm'; 
import usuarioRouter from './usuario/usuario.routes';
import viajeRouter from './viaje/viaje.routes';

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});
app.use('/api/usuarios', usuarioRouter);
app.use('/api/viajes', viajeRouter);

export default app;