
export default async(req,res,next)=>{
    if (req.isAuthenticated()) { 
        next()
    }else{
        //console.log("Can not authenticated!");
        res.redirect("/login");
    }
}

export const checkLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) { 
        return res.redirect("/chat")
    }
    next()
}