import express from 'express';
import { CreFun, DelFun, GetDetFun, GetFun, UpdFun } from '../controllers/ProCont.js';
// import { Autherize } from '../Middlewear/Auth.js';

export const Prorouter=express.Router();
Prorouter.post('/cre',CreFun);
Prorouter.get('/get-prod',GetFun);
Prorouter.get('/get/:id',GetDetFun);
Prorouter.put('/upd/:id',UpdFun);
Prorouter.delete('/del/:id',DelFun);
