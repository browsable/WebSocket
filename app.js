/**
 * Created by admin on 2015-08-13.
 */

    // 1. 필요한 module require
    // websocket server를 만들어서 http server와 같이 기동시킴
    // 멀티플렉싱을 이용하면 하나의 포트를 여러프로그램이 공유해서 사용할 수 있음
    // 하나의 포트번호를 websocket, http server를 같이 기동시킴
    var http = require("http"),
        express = require("express"),
        app = express(),
        server = http.createServer(app), // http server 생성
        io = require("socket.io").listen(server); //websocket server - http server와 붙어서 같이 기동한다는 의미

        app.get("/", function(req,res){
            //내가 가지고 있는 html file을 클라이언트에게 전송
            res.sendFile("websocketClient.html",{
                root : __dirname //project root에서 파일을 찾아라
            });
        });

        //서버에 클라이언트가 접속하는 순간 connection 이벤트가 발생함
        io.on("connection",function(socket){ // 여기서의 socket은 클라이언트와 연결되어있는 서버쪽 소켓임
            //console.log("클라이언트가 접속했어요!!");
            //클라이언트에게 환영합니다.라는 내용을 보내줌
            // 서로 연결되어있는 소켓에 대해 데이터를 보내기 위해 서버쪽에서 emit을 통해 이벤트 발생시킴
            socket.emit("welcome",{
                msg : "환영합니다.!!"
            });
            socket.on("clientMSG", function(data){
                //socket.emit("serverMSG",{ -> io로 바꿔주면 모든 클라이언트에게 전달. 1:n 통신
                io.emit("serverMSG",{
                    msg : data.msg // 클라이언트로 받은 메시지를 다시 클라이언트에게 보내줌
                })
            })
        });

        server.listen(5000,"localhost");
        console.log("웹소켓 서버 기동 -5000");
