;(()=>{
   "use strict"
   const express = require('express'),
   	 app = express(),
	 log4js = require('log4js')
   
   console.log("hello world")  

   app.get("/:test/:id", (req,res) => {
	res.end(JSON.stringify({
	  hello:req.params.id,
	  foo:req.params.test
	}))
 
   })

   const server = app.listen(8080, () => {
     console.log("listening")

   })

   console.log("tesT")

})()
