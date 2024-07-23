var express = require("express");
var mysql = require("mysql2");
var fileuploader = require("express-fileupload");
const nodemailer=require("nodemailer");
let app = express();

app.listen(2022, function () {
    console.log("Server Started :)");
})
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.email",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "sajalsowna9@gmail.com",
      pass: "mtfi xdds dfvo lseh",
    },
  });
app.use(express.static("public"));
app.use(express.urlencoded("true"));// converts binary form data to JSON Object
app.use(fileuploader());
// let config = {
//     host: "127.0.0.1",
//     user: "root",
//     password: "sajal@123",
//     database: "project",
//     dateStrings: true
// }
let config = {
    host: "bmav8kao9ale44t1vd75-mysql.services.clever-cloud.com",
    user: "unyk0wjisou6llsw",
    password: "DOTYVoPUkNjzk2owrbI1",
    database: "bmav8kao9ale44t1vd75",
    dateStrings: true,
    keepAliveInitialDelay : 10000,
    enableKeepAlive : true
}
var mysql = mysql.createConnection(config);
mysql.connect(function (err) {
    if (err == null)
        console.log("Connected To Database Successfulllyyyy");
    else
        console.log(err.message);

})

app.get("/", function (req, resp) {
    let path = __dirname + "/public/index.html";
    resp.sendFile(path);

})
app.get("/signup-process", function (req, resp) {
    console.log(req.query);

    let email = req.query.txtEmail;
    let pwd = req.query.pwd;
    let utype = req.query.combo;

    mysql.query("insert into users values(?,?,?,1)", [email, pwd, utype], function (err) {
        if (err == null) {
            resp.send("SignedUp Successfullyy")
        }
        else
            resp.send(err.message);
    })
})

app.get("/login-process", function (req, resp) {
    //console.log("login-process");
    let emaill = req.query.txtEmaill;
    let txtPwd = req.query.txtPwd;

    mysql.query("select * from users where email=? and pwd=?", [emaill, txtPwd], function (err, result) {
        if (err != null) {
            resp.send(err.message); return ;
        }
        if (result.length == 0) {
            resp.send("Invalid Id or Password"); return ;
        }
        if (result[0].status == 1) {
            resp.send(result[0].utype); return ;
        }
        else {
            resp.send("U R Blocked!!!"); return;
        }

    })

})
app.post("/profile-save",function(req,resp)
{
    let filename="";
    if(req.files.ppic!=null)
    {
        filename=req.files.ppic.name;
        let path=__dirname + "/public/uploads/" + filename;
        req.files.ppic.mv(path);
    }
    else {
        filename = "nopic.jpg";
    }
     mysql.query("insert into iprofile values(?,?,?,?,?,?,?,?,?,?,?,?,?)",[req.body.Email,req.body.name,req.body.gender,filename,req.body.dob,req.body.Address,req.body.city,req.body.cont,req.body.field,req.body.insta,req.body.fb,req.body.youtube,req.body.other],function(err)
    {
        if (err == null)
            resp.send("bahut badia......");
        else
            resp.send(err.message);
    })
})
app.post("/cprofile-save",function(req,resp)
{
     mysql.query("insert into cprofile values(?,?,?,?,?,?)",[req.body.Email,req.body.name,req.body.state,req.body.city,req.body.coll,req.body.cont],function(err)
    {
        if (err == null)
            resp.send("bahut badia......");
        else
            resp.send(err.message);
    })
})
app.post("/cprofile-modify",function(req,resp){

    mysql.query("update cprofile set cname=?, state=?, city=?, collaborator=?,contact=? where email=?",[req.body.name, req.body.state, req.body.city, req.body.coll, req.body.cont,req.body.Email],function(err,result){
        if(err==null){
            if(result.affectedRows>=1){
                resp.send("Record Updated successfulllyy....");
            }
            else{
                resp.send("Invalid Email ID");
            }
        }
        else{
            resp.send(err.message);
        }
    })
})
app.post("/profile-update",function(req,resp){
    
    let fileName="";
    if(req.files!=null){
        fileName=req.files.ppic.name;
        let path=__dirname+"/public/uploads/"+fileName;
        req.files.ppic.mv(path);
    }
    else{
        fileName=req.body.hdn;
    }
    //req.body.ppic=fileName;
    //resp.send(req.body);

    mysql.query("update iprofile set iname=?, gender=?, dob=?, address=?, city=?, contact=?, field=?, insta=?, fb=?, youtube=?, others=?, picpath=? where email=?",[req.body.name, req.body.gender, req.body.dob, req.body.address, req.body.city, req.body.cont, req.body.field, req.body.insta, req.body.fb, req.body.youtube, req.body.other, fileName,req.body.Email],function(err,result){
        if(err==null){
            if(result.affectedRows>=1){
                resp.send("Record Updated successfulllyy....");
            }
            else{
                resp.send("Invalid Email ID");
            }
        }
        else{
            resp.send(err.message);
        }
    })
})

app.get("/post-process", function (req, resp) {
    console.log("hi")
    email = req.query.email;
    event = req.query.event;
    date = req.query.date;
    time = req.query.time;
    city = req.query.city;
    venue = req.query.venue;
    mysql.query("insert into eventts values(?,?,?,?,?,?)", [email, event, date, time, city, venue], function (err) {
        if (err == null)
            resp.send("Bahut Bahut Badhai.....");
        else
            resp.send(err.message);
    })
})

app.get("/update-process", function (req, resp) {
    console.log("hi");
    email = req.query.email;
    opass = req.query.opass;
    npass = req.query.npass;
    cpass = req.query.cpass;
    change = req.query.change;
    mysql.query("select pwd from users where email=?", [email], function (err,result) {
        if (err == null)
            
            {
                if(opass==result[0].pwd)
                {
                     if(npass==cpass)
                     {
                        mysql.query("update users set pwd=? where email=?",[npass,email],function(err,result)
                        {
                            if(err==null)//no error
                            {
                                       resp.send("Updated  Successfulllyyyy....");
                        
                            }
                        })
                     }    
                }
            }
        else
            resp.send(err.message);

    })
})
app.post("/mail-send",function(req,resp)
{
    let txtEmaill=req.body.txtEmaill;
    
    mysql.query("select * from users where email=?",[txtEmaill],function(err,result){
        
        if(err==null)
        {
            async function main() {
                // send mail with defined transport object
                const info = await transporter.sendMail({
                  from: '"if you know u know 👻" <sajalsowna9@gmail.com>', // sender address
                  to: txtEmaill, // list of receivers
                  subject: "PASSWORD✔", // Subject line
                  text:result[0].pwd, // plain text body
                  html:result[0].pwd, // html body
                  attachments:
                  {
                    filename: "messi.jpeg",
                    path: __dirname+"/pics/"+ "messi.jpeg",
                    contentType: "image/jpeg/jpg"
                  }
                });
              
                console.log("Message sent: %s", info.messageId);
                // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
              }
              
              main().catch(console.error);   
        }
        else
        resp.send(err.message);

  })
   
  
})

app.get("/infl-desh",function(req,resp)
{
    let path=__dirname+"/public/infl-desh.html";
    resp.sendFile(path);
})
app.get("/infl-find",function(req,resp)
{
    let path=__dirname+"/public/influ-finder.html";
    resp.sendFile(path);
})
app.get("/admin",function(req,resp)
{
    let path=__dirname+"/public/Admin-dash.html";
    resp.sendFile(path);
})
app.get("/fetch-all",function(req,resp)
{
    mysql.query("select * from users",function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultJsonAry);//sending array of json object 0-1
    })

})
app.get("/fetch-by-fc",function(req,resp)
{
    // console.log(req.query.city);
    mysql.query("select * from iprofile where field like ? && city = ?",["%"+req.query.field+"%",req.query.city],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultJsonAry);//sending array of json object 0-1
    })

})
app.get("/fetch-events", function (req, resp) 
    {
        mysql.query("select * from eventts where dates>=current_date() && bemail=?",[req.query.email],function (err,result) {
            if(err!=null)
                {
                    resp.send(err.message);
                    return;
    
                }
           resp.send(result);//sending array of json object 0-1
        })
    })
    app.get("/find-user",function(req,resp)
{
    let email=req.query.Email;
    mysql.query("select * from iprofile where email=?",[email],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultJsonAry);//sending array of json object 0-1
    })
}) 

app.get("/find-client",function(req,resp)
{
    let email=req.query.Email;
    mysql.query("select * from cprofile where email=?",[email],function(err,resultAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;
            }
       resp.send(resultAry);//sending array of json object 0-1
    })
}) 

app.get("/fetch-by-name",function(req,resp)
{
    // console.log(req.query.city);
    mysql.query("select * from iprofile where iname like ?",["%"+req.query.name+"%"],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultJsonAry);//sending array of json object 0-1
    })

})
app.get("/change-field",function(req,resp)
{
    mysql.query("select * from iprofile where field=?",[req.query.field],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultJsonAry);//sending array of json object 0-1
    })

})
app.get("/fetch-all-fields",function(req,resp)
{
    mysql.query("select distinct field from iprofile",function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultJsonAry);//sending array of json object 0-1
    })

})
app.get("/fetch-all-city",function(req,resp)
{
    mysql.query("select distinct city from iprofile",function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultJsonAry);//sending array of json object 0-1
    })

})
app.get("/fetch-infl",function(req,resp)
{
    mysql.query("select * from users where utype=?",["Influencer"],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultJsonAry);//sending array of json object 0-1
    })

})
app.get("/del-one",function(req,resp)
{
    mysql.query("delete from users where email=?",[req.query.email],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
            resp.send("Deleted");
       
    })

})
app.get("/del-event",function(req,resp)
{
    console.log(req.query.email);
    mysql.query("delete from eventts where bemail=?",[req.query.email],function(err){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
            resp.send("Deleted");
       
    })

})
app.get("/doblock",function(req,resp)
{

    mysql.query("update users set status=? where email=?",[0,req.query.email],function(err,resultJsonAry){
        if(err!=null)
            {
            resp.send(err.messgae);
            }
       resp.send("blocked");//sending array of json object 0-1
    })

})
app.get("/doresume",function(req,resp)
{

    mysql.query("update users set status=? where email=?",[1,req.query.email],function(err,resultJsonAry){
        if(err!=null)
            {
            resp.send(err.messgae);
            }
       resp.send("Unblocked");//sending array of json object 0-1
    })

})
