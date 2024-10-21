//Login Form VAlidation
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', (e) =>{
     e.preventDefault()

    //  /Fetching Error Divs
const emailErr = document.querySelector('.emailErr');
const passwordErr = document.querySelector('.passwordErr');

// //Resetting Regex
emailErr.innerHTML = '';
passwordErr.innerHTML = '';

//Getting Input Values
const email = loginForm.email.value;
const password = loginForm.password.value; 

// Regex for the Inputs

const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordReg = /^(?:[0-9A-Za-z!@#$%^&*()\-+=_{}\[\]|:;"'<>,.?\\/ ])+$/;

// If Statements
if (!emailReg.test(email)) {
     emailErr.innerHTML = 'Enter Valid Email Address';
     return;
};

if (!passwordReg.test(password)) {
     passwordErr.innerHTML = 'Incorrect Password';
     return;
}

const data = {email, password}

fetch('/sign-in', {
     method: 'POST', // *GET, POST, PUT, DELETE, etc.
     headers: {
         'Content-Type': 'application/json'
     },
     body: JSON.stringify(data)
 })
 .then(res => res.json())
   .then((data) => {
       if (data.success) {
           $(document).ready(() => {
               iziToast.success({
                   title: 'Ok',
                   message: data.msg,
               });
           });

           setInterval(() => {
               window.location.href = data.redirectURL;
           }, 2000);
       }
       if (data.error) {
           // Invoke the toast component
           $(document).ready(() => {
               iziToast.error({
                   title: 'Error',
                   message: data.error,
               });
           });
       }
   })
   .catch(e => {
       console.log(e)
   })

});



