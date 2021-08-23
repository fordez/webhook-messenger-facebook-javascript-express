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
            handleEvent(event.sender.id, event);
        });
    }
    res.sendStatus(200);
});

function handleEvent(senderId, event) {
    if(event.message){
        handleMessage(senderId, event.message)
    }
       
}

function handleMessage(senderId, event) {
    if(event.text){
        defaultMessage(senderId);   
    }
    
}

function defaultMessage(senderId){
    const messageData = {
        "recipient":{
            "id": senderId
        },
        "message":{

            "text":"Hola, un gusto en atenderte soy Chatrobot"
        }
    }
    callSendApi(messageData);
}

function callSendApi(response){
    request({
        "uri":"https://graph.facebook.com/me/messages/",
        "qs":{
            "access_token": "EAAGF6XxARsMBAFBXTiKhg6sE6OqAtpn3R7Hz9sIXvL3RQ275ebEHSUJLRoKfCDlQSBva6ZB5hagGh62pXNorMilH9Sm4RhQhZBJPHZBbSqo8FVGvjJZAwau93svQEvPwsn4RZCQl8kTXMRPwig5FkhcLlxeUJJ3CXGabXTJLOMUtm85vlb7Y1"
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

