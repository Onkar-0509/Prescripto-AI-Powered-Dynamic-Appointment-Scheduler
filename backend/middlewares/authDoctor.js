import jwt from "jsonwebtoken"


const authDoctor=async(req,res,next)=>{
    try{
        
        const {dtoken} =req.headers

        if(!dtoken){
            return res.status(404).json({
                success:false,
                message:'Not Authorised Login again'
            })
        }
        const token_decoded=jwt.verify(dtoken,process.env.JWT_SECRET)
         req.body.docId=token_decoded.id
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

export default authDoctor