;(()=>{
   "use strict"
   const express = require('express'),
   	 app = express(),
	 log4js = require('log4js')
   
  

   app.get("/foo/:id", (req,res) => {
	res.end(JSON.stringify({
	  hello:req.params.id
	}))
 
   })

   const server = app.listen(8080, () => {
     console.log("listening")

   })

   console.log("tesT")

})()
