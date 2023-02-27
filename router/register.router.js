import User from '../model/user.model.js';
import bcrypt from 'bcryptjs';

export default  (req, res) => {
  res.render("register");

}


export const registerPostRouter = async(req,res)=>{
  
  const { name, email, password } = req.body;
  if(name.trim() ==="" || email.trim() ==="" || password.trim() === ""){
    return res.send("Input must be valid");
  }
  
  try {
    const userExit = await User.findOne({ email });
    if(userExit){
      return res.send("User already Exist!");
    }

    const hashedPw = await bcrypt.hash(password, 12);
    const user = await new User({
      name,
      email,
      password: hashedPw
    }).save();

    //console.log(user);
    if(user){
      return res.redirect("/login");
    }else{
      res.send("Server down!");
    }
  } catch (error) {
    console.log(error);
  }

}