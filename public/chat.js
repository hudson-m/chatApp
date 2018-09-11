$(function(){
    //Realiza conexão
    var socket = io.connect('http://localhost:4200');

    //Botões e inputs
    var message = $("#message");
    var username = $("#username");
    var send_message = $("#send_message");
    var send_username = $("#send_username");
    var chatroom = $("#chatroom");

    //Criar Mensagem
    send_message.click(function(){
        socket.emit('new_message', {message : message.val()})
    });

    //listen do new_message
    socket.on("new_message", (data) => {
        console.log(data);
        chatroom.append("<p class='message'>" + data.username + ":" + data.message + "</p>");
    });

    //Criação APelido
    send_username.click(function(){
        console.log(username.val());
        socket.emit('change_username', {username : username.val()})        
    });
});