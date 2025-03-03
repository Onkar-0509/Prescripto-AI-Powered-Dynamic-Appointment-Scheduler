import jwt from "jsonwebtoken"


const authUser=async(req,res,next)=>{
    try{
        
        const {token} =req.headers

        if(!token){
            return res.status(404).json({
                success:false,
                message:'Not Authorised Login again'
            })
        }
        const token_decoded=jwt.verify(token,process.env.JWT_SECRET)
         req.body.userId=token_decoded.id
        next()

    }
    catch(error){
        console.log(error)
        res.status(500).json({
            success:false,
            message:error.message
        })

    }

}

export default authUser