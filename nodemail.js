const nodemailer=require("nodemailer");
var express=require("express");
let app=express();

app.listen(2025,function()
{
    console.log("Server Started :-)");
})
app.use(express.static("public"));
app.use(express.urlencoded("true"));// converts binary form data to JSON Object

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
  app.get("/signup",function(req,resp)
{
    let path=__dirname+"/public/mailsender.html";
    resp.sendFile(path);
})
  app.post("/mail-send",function(req,resp)
{
    let email=req.body.txtEmail;
    
  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"if you know u know 👻" <sajalsowna9@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "GOAT OF FOOTBALL!!", // plain text body
      html: "<b>IT's LEO mehhssiii!!</b>", // html body
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
})