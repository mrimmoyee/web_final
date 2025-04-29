import {getAuth, signOut, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const auth = getAuth();

    const sidebar = document.getElementById("sidebar");
    const menuButton = document.getElementById("menuButton");
    const closeButton = document.getElementById("closeButton");
    const logoutLink = document.getElementById("logoutLink");

    menuButton.addEventListener("click", () => {
        sidebar.style.width = "250px";
    });

    closeButton.addEventListener("click", () => {
        sidebar.style.width = "0";
    });

    logoutLink.addEventListener("click", () => {
        signOut(auth)
            .then(() => {
                window.location.href = "index.html";
            })
            .catch((error) => {
                console.error("Error logging out:", error);
            });
    });

    function showMessage(message, divId){
        var messageDiv=document.getElementById(divId);
        messageDiv.style.display="block";
        messageDiv.innerHTML=message;
        messageDiv.style.opacity=1;
        setTimeout(function(){
            messageDiv.style.opacity=0;
        },5000);
      }

    const signIn=document.getElementById('submitSignIn');
    signIn.addEventListener('click', (event)=>{
      event.preventDefault();
      const email=document.getElementById('email').value;
      const password=document.getElementById('password').value;
      const auth=getAuth();
    
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential)=>{
          showMessage('Connected', 'signInMessage');  
           alert("Connected");   
          const user=userCredential.user;
          localStorage.setItem('loggedInUserId', user.uid);
           window.location.href='create_quiz.html';
      })
      
      .catch((error)=>{
          const errorCode=error.code;
          if(errorCode==='auth/invalid-credential'){
              showMessage('Incorrect Email or Password', 'signInMessage');
          }
          else{
              showMessage('Account does not Exist', 'signInMessage');
          }
      })
    });

    


});