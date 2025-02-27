const jwt=require("jsonwebtoken");
require("dotenv").config();
const User=require("../models/User");

//auth 
exports.auth=async(req,res,next)=>{
    try{
        //extracty token
        const token=req.cookies.token
                        || req.body.token
                        || req.header("Authorization").replace("Bearer ","");

        //if token missing,then return response
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is mssing",
            });
        }

        //verify the token

        try{
            const decode=jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user=decode;
        }
        catch(error){
            //verification issue
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            });
        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token',
        });
    }
}


//is Student

exports.isStudent=async(req,res,next)=>{
    try{
        if(req.user.accounType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is the protected route for students only",
            })
        }
       next();
    }
    catch(error){
        return res.status(500).json({
                success:false,
                message:"User role cannot be verified, please try again later",
            })
    }
}

//is Instructor

exports.isInstructor=async(req,res,next)=>{
    try{
        if(req.user.accounType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is the protected route for Instructor only",
            })
        }
       next();
    }
    catch(error){
        return res.status(500).json({
                success:false,
                message:"User role cannot be verified, please try again later",
            })
    }
}

// isAdmin

exports.isAdmin=async(req,res,next)=>{
    try{
        if(req.user.accounType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is the protected route for Admin only",
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
                success:false,
                message:"User role cannot be verified, please try again later",
            })
    }
}