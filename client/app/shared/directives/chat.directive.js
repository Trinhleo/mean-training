(function () {
    angular.module('app')
        .directive('chat', Chat);
    Chat.$inject = ['$localStorage', '$rootScope', '$timeout']
    function Chat($localStorage, $rootScope, $timeout) {
        return {
            restrict: 'E',
            templateUrl: './app/shared/directives/chat.directive.html',
            link: linkFn,
            scope: {
                room: '=room'
            }
        }

        function linkFn(scope) {
            var socket = io.connect('http://localhost:3000');
            scope.roomName = "Please choose a room chat!"
            scope.alert = "";
            scope.roomInfo = {};
            scope.currentRoom = 0;
            scope.counterLineOfMessage = 0;
            scope.message = "";
            scope.messagebox = "";
            scope.online = [];
            scope.user = $localStorage.user;
            scope.sendMessage = sendMessage;
            scope.joinRoom = joinRoom;
            scope.leaveRoom = leaveRoom;
            scope.displayMessage = displayMessage;
            scope.showChat = true;
            scope.toggleChatBox = toggleChatBox;

            function toggleChatBox() {
                scope.showChat = scope.showChat ? false : true;
            }

            // =========TRIGGER ON RECEIVE MESSAGE FROM SOCKET SERVER=========
            // authenticate

            socket.on('connect', function () {
                socket.emit('authenticate', { token: $localStorage.token });
            });

            $timeout(function () {
                joinRoom(scope.room);
            }, 1000);


            socket.on('alert', function (msg) {
                scope.alert = msg;
                $timeout(300, function () {
                    console.log('waiting');
                });
            });

            //
            socket.on('banned alert', function (msg) {
                scope.alert = msg.message;
                displayMessage(msg.user, msg.message);
                $timeout(3000, function () {
                    console.log('waiting');
                });
                scope.enableChat = false;
                scope.online = [];
            });
            // trigger receive message
            socket.on('chat message', function (msg) {
                // var lastIndex = msg.length - 1;
                scope.displayMessage(msg.user, msg.message);
            });

            // trigger receive message
            socket.on('online', function (msg) {
                scope.online = msg;
                $timeout(300, function () {
                    console.log('waiting');
                });
            });


            // trigger join to a room chat
            socket.on('join', function (msg) {
                console.log(msg)
                if (msg.userInfo) {
                    scope.online.push(msg.userInfo);
                };
                scope.displayMessage(msg.user, msg.message);
                $timeout(300, function () {
                    console.log('waiting');
                });
                console.log('----Online----')
                console.log(scope.online);
            });

            // trigger leave to a room chat
            socket.on('leave', function (msg) {
                console.log(msg)
                for (var x in scope.online) {
                    if (msg.userLeaveId && scope.online[x]._id.toString() === msg.userLeaveId) {
                        scope.online.splice(x, 1);
                        break;
                    };
                };
                console.log('----Online----')
                console.log(scope.online);
                scope.displayMessage(msg.user, msg.message);
                $timeout(300, function () {
                    console.log('waiting');
                });
            });
            // load history message
            socket.on('load messages', function (msg) {
                console.log(msg)
                for (var x in msg) {
                    var userDisplay = {
                        nickname: msg[x].user.firstName.concat(msg[x].user.lastName),
                        avatar: msg[x].user.profileImageURL
                    }
                    scope.counterLineOfMessage++;
                    scope.displayMessage(userDisplay, msg[x].message);
                };

            });
            // =======INTERAL FUNCTION=======

            function sendMessage(msg) {
                if (msg === "") {
                    $('#m').focus();
                    return;
                }
                scope.counterLineOfMessage++;
                console.log(msg);
                scope.message = "";
                socket.emit('chat message', msg);
            };
            // key listener
            $(function () {

                $('#m').keypress(function (e) {
                    if (e.which == 13) {
                        $(this).blur();
                        $('#send').focus().click();
                        $('#m').focus();
                    }
                });

                $('#roomName').keypress(function (e) {
                    if (e.which == 13) {
                        $(this).blur();
                        $('#submitRoom').focus().click();
                        $('#roomName').focus();
                    }
                });

            });

            // join a room chat
            function joinRoom(room) {

                if (scope.currentRoom === room._id) {
                    return;
                }
                else {
                    $('.messages').children().remove();
                    scope.counterLineOfMessage = 0;
                }
                scope.roomName = room.name;
                scope.currentRoom = room._id;
                console.log(room.name);
                scope.online = [];
                socket.emit('join', room);
                scope.enableChat = true;

            };
            // leave a room chat
            function leaveRoom() {
                socket.emit('leave');
                scope.enableChat = false;
                scope.currentRoom = 0;
                scope.online = [];
                scope.roomName = "Please choose a room chat!";
                $('.messages').children().remove();
                scope.counterLineOfMessage = 0;

            };
            // display message on message window
            function displayMessage(user, msg) {
                if (scope.counterLineOfMessage > 5) {
                    $('.messages').children().first().remove();
                    scope.counterLineOfMessage--;
                }
                var avatar = user.avatar || "";
                console.log(avatar);
                var nickname = user.nickname;
                // var linkProfile = '#'
                var message = msg;
                var display = '<li class="list-group-item">'
                    + '<img alt="" class="img-responsive text-center" style="height: 32px; width: 32px;border-radius: 50%;border: 1px solid rgba(0,0,0,0.1);" src="'
                    + avatar + '"/><span> ' + nickname + '</span>: ' + message + '</li>';

                $('.messages').append($(display));
            };
        };
    };
})();