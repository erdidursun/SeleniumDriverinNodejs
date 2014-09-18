var webdriver = require('selenium-webdriver');
var fs=require('fs');
var cheerio = require('cheerio');
var express=require('express');
var session = require('express-session');
var driver;


var app=module.exports=express()
   ,env = process.env.NODE_ENV || 'development';

if ('development' == env) {

   	app.set('trust proxy', 1) // trust first proxy   
  	app.set('views', __dirname + '/views');
  	app.set('view engine', 'jade'); 	
	app.use(
		session({secret: '1234754er22rrd14vc5'})
	);
}


function setEmail(mailelementname,mailaddress){

	var element=driver.findElement(webdriver.By.name(mailelementname));
	element.clear();
	element.sendKeys(mailaddress).then(function(){

	    element.getAttribute("value").then(function(title){

			   if(title!=mailaddress){
			   	return setEmail(mailelementname,mailaddress);
			   	console.log(title);
			   }		 
		});		
	});
}
function setPassword(pswelementname,password){

	var element=driver.findElement(webdriver.By.name(pswelementname));
	element.clear();
	element.sendKeys(password).then(function(){

		 element.getAttribute("value").then(function(psw){
		 	if(psw!=password){
			   	return setPassword(pswelementname,password);
			   	console.log(psw);
			}
		 });
	});

}

app.get('/',function(req,res){

		var senderT=[],mailT=[],ss=[];	
		driver = webdriver.Chrome(executable_path='/usr/local/bin/chromedriver')
	
		
		driver.get('http://www.gmail.com').then(function(){
		    setEmail('Email','erdidursun13');
		    setPassword('Passwd','yourpasswordhere');
		    driver.findElement(webdriver.By.name('signIn')).submit();
		    setTimeout(function(){
				driver.getPageSource().then(function (chunk) {	
						//fs.writeFile('source.html',chunk,'utf8');
					driver.close();	
					var htm=cheerio.load(chunk);
					var elements=htm('.yP').get();								
					var count=elements.length,i=0;
					while(i<count){
						senderT.push(elements[i].attribs.name);	
						mailT.push(elements[i].attribs.email.trim())					
						if(elements[i].next!=null)
							ss.push(elements[i].next.data.trim());						 
						i++;
					}
				    res.render('index', {senders: senderT,mails:mailT,details:ss});						
			    });
		    },15000);
		});		

});
app.listen(1515);




//driver.quit();
