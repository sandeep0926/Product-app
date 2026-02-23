import express from 'express';
import { CreFun, DelFun, GetDetFun, GetFun, UpdFun } from '../controllers/ProCont.js';
import { TranscribeFun } from '../controllers/TranscribeCont.js';
import { Autherize } from '../Middlewear/Auth.js';
import { isAdmin } from '../Middlewear/isAdmin.js';
import { upload } from '../Middlewear/Img.js';

export const Prorouter = express.Router();

Prorouter.get('/get-prod', Autherize, GetFun);
Prorouter.get('/get/:id', Autherize, GetDetFun);

Prorouter.post('/cre', Autherize, isAdmin, upload.array('images', 5), CreFun);
Prorouter.put('/upd/:id', Autherize, isAdmin, upload.array('images', 5), UpdFun);
Prorouter.delete('/del/:id', Autherize, isAdmin, DelFun);


Prorouter.post('/transcribe', Autherize, isAdmin, upload.single('audio'), TranscribeFun);
