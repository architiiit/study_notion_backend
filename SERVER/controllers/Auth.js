const User=require("../models/User");
const OTP=require("../models/OTP");
const Profile=require("../models/Profile");
const otpGenerator=require("otp-generator");
const bcrypt = require('bcrypt');
const jwt=require("jsonwebtoken")
require("dotenv").config();
//send OTP

exports.sendOTP=async (req,res)=>{

    try{

        //fetch email from request ki body
        const {email}=req.body;
    
        //check if user already exist
        const checkUserPresent=await User.findOne({email});
    
        //if user already exists then return a response
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User already registered",
            })
        }

        //generate otp
        var otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("OTP generated :",otp);

        //check unique otp or not
        const result=await OTP.findOne({otp:otp});

        while(result){
            otp=otpGenerator(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });

            const result=await OTP.findOne({otp:otp});
        }


        const otpPayload={email,otp};
        //create an entry in db for otp
        const otpBody=await OTP.create(otpPayload);
        console.log(otpBody);

        //return response Successfully

        res.status(200).json({
            success:true,
            message:"OTP sent successfully",
            otp,
        });


    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}


//sign up

exports.signUp=async(req,res)=>{

    try{

        //fetch data from the request body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
            }=req.body;
        //validate the data
            if(!firstName||!lastName||!email||!password||!confirmPassword||!otp){
                return res.status(403).json({
                    success:false,
                    message:"All fields are required",
                })
            }
    
        //2 passwords match them
            if(password!=confirmPassword){
                return res.status(400).json({
                    success:false,
                    message:"Password and confirmPassword does not match ,Please try again",
                })
            }
        //check user already exists or not
            const existingUser=await User.findOne({email});
            if(existingUser){
                return res.status(400).json({
                    success:false,
                    message:"User is already registered",
                });
            }
        //find most recent OTP for the user
            const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1);
            console.log(recentOtp);
        //validate OTP
            if(recentOtp.length==0){
                //otp not found
                return res.status(400).json({
                    success:false,
                    message:"OTP not found",
                })
            }else if(otp !==recentOtp.otp){
                //invalid otp
                return res.status(400).json({
                    success:false,
                    message:"Invalid OTP",
                })
            }
        //Hash the password
            const hashedPassword=await bcrypt.hash(password,10);
    
    
        //entry in db
            const profileDetails=await Profile.create({
                gender:null,
                dateOfbirth:null,
                about:null,
                contactNumber:null,
            })
            
            const user=await User.create({
                firstName,
                lastName,
                email,
                contactNumber,
                password:hashedPassword,
                accountType,
                additionalDetails:profileDetails._id,
                image:`http://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastname}`,//an api which creates image icon using name
            })
    
        //return response

        return res.status(200).json({
            success:true,
            message:'User is registered Successfully',
            user,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered . Please try again "
        })
    }
    
}


//Login
exports.login=async(req,res)=>{
    try{
        //get data from request ki body
        const {email,password}=req.body;

        //validate data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are required, please try again later",
            });
        }

        //user check exists or not
        const user=await User.findOne({email}).populate("additionalDetails");

        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered, please signup first",
            });
        }

        //generate JWT token after password match
        if(await bcrypt.compare(password,user.password)){
            const payload={
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            }
            const token=JsonWebTokenError.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            });

            user.token=token;
            user.password=undefined;

        
            //create cookie and response send

            const options={
                expires:new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in successfully",
            })
        }else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect",
            })
        }

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Login Failure, please try again',
        });
    }
};



//change password:TODO
exports.changePassword=async(req,res)=>{
    //get data from req body

    //get Oldpassword,newPassword,confirmNewPassword

    //validation

    //update pwd in db

    //send mail-Password updated

    //return response
}

