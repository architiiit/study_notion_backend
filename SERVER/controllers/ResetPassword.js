const User=require("../models/User");
const mailSender=require("../utils/mailSender");
const bcrypt=require("bcrypt");

//resetPasswordToken-->sending mail
exports.resetPasswordToken=async(req,res)=>{
    try{
        //get email from request body
        const email=req.body.email;
    //check user for this email,email verification
    const user=await User.findOne({email:email});
    if(!user){
        return res.json({
            success:false,
            message:"Your email is not registered with us",
        })
    }
    //generate Token
    const token=crypto.randomUUID();
    //update user by adding token and expiration time
    const updateddetails=await User.findOneAndUpdate(
                                                    {email:email},
                                                    {
                                                        token:token,
                                                        resetPasswordExpires:Date.now()+5*60*1000,
                                                    },
                                                    {new:true});
    //create url
    const url=`http://localhost:3000/update-password/${token}`;

    //send mail constaining the url
    await mailSender(email,
                    "Password reset link",
                    `Password Reset Link ${url} `);
    //return response
        return res.json({
            success:true,
            message:'Email sent successfully, pleasde check mail and change password',
        });
    }
    catch(error){
        console.log(error);
        response.status(500).json({
            success:false,
            message:'Something went wrong while sending reset password mail',
        });
    }


}



//reset password
exports.resetPassword=async(req,res)=>{
   try{
         //data fetch 
    const {password,confirmPassword,token}=req.body;
    //validation
    if(password!==confirmPassword){
        return res.json({
            success:false,
            message:"Password not matching",
        });
    }
    //get userdetails from db using Token
    const userDetails=await User.findOne({token:token});
    //if no entry-invalid token 
    if(!userDetails){
        return res.json({
            success:false,
            message:"Token is invalid",
        });
    }
    //check token time
    if(userDetails.resetPasswordExpires<Date.now()){
        return res.json({
            success:false,
            message:'Token is expired ,please regenerate your token',
        })
    }
    //hash password 
    const hashedPassword=await bcrypt(password,10);

    //update password
    await User.findOneAndUpdate(
        {token:token},
        {password:hashedPassword},
        {new:true},
    )
    //return response
    return res.status(200).json({
        success:true,
        message:'Password reset successfull',
    })

   }
   catch(error){
    console.log(error);
        res.status(500).json({
            success:false,
            message:'Something went wrong while sending reset password mail',
        });
   }
}


