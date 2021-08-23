"use strict"

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const { response } = require("express");

const app = express();

app.set("port",5000);
app.use(bodyParser.json());

app.get("/",function(req, response){

    response.send("hola fordez");
});

app.get("/webhook", function(req,response){
    if (req.query["hub.verify_token"]==="pugpizza_token"){
        response.send(req.query["hub.challenge"]);

    }else{
        response.send("pug pizza no tines permisos")
    }
});

app.post("/webhook",function(req, res){
    const webhook_event = req.body.entry[0];
    if(webhook_event.messaging){
        webhook_event.messaging.forEach(event => {
            console.log(event.message.text);
            handleMessage(event);
        });
    }
    res.sendStatus(200);
});

function handleMessage(event){
    const senderId = event.sender.id;
    const messageText = event.message.text;
    const messageData = {
        recipient:{
            id: senderId
        },
        message:{
            text: messageText
        }
    }
    callSendApi(messageData)
}

function callSendApi(response){
    request({
        "uri":"https://graph.facebook.com/me/messages/",
        "qs":{
            "access_token": "EAAGF6XxARsMBAOurdPL2X0oOYQjEsZBSG8bknihozFZCl3cJb3MfOYGT48dsBL9LBnmSLrcYHHaitnuaoQ79u5ftEHq1KyDuCyNdhnGHDzYBlBxwtwrNjiWSPI24x8oSHF6QOtV2L4xCa3VjcrSgveMsBhcD4Y6dGczL5lxvoQnPBYakpU"
        },
        "method": "POST",
        "json": response
        },
        function(err) {
            if(err){
                console.log("Ha ocurrido un error")
            }else{
                console.log("Mensaje enviando")
            }
        }
    )
}

app.listen(app.get("port"), function(){
    console.log("Nuestro servidor esta funcionando en el puerto", app.get("port"));
})

