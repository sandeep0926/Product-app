import express from "express";
import { Login, Reg } from "../controllers/AuthCont.js";
import { LogVal, RegVali } from "../Middlewear/AuthValid.js";

export const Authrouter=express.Router();


Authrouter.post('/login',LogVal,Login);
Authrouter.post('/reg',RegVali,Reg);
