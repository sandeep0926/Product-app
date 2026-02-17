import Joi from "joi";

export const RegVali = (req,res,next) => {
 
    const Schema = Joi.object({
      name: Joi.string().min(3).max(50).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(4).max(50).required(),
    });
  
    const {error}=Schema.validate(req.body);
    if(error){
       return res.status(400).json({message:"ERROR OCCURED IN REG VALIDATION..."})
    }
    next();
  
};
 
export const LogVal=(req,res,next)=>{
    const Schema1=Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().min(4).max(50).required(),
    })
    const {error}=Schema1.validate(req.body);
    if(error){
        return res.status(400).json({message:"ERROR OCCRED IN LOGIN VALIDATION..."})
    }
    next();
}