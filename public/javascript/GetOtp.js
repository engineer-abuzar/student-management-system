document.addEventListener("DOMContentLoaded", function() {
    const email = document.getElementById('email');
    const btn = document.getElementById('otpSendButton');

    if (!email || !btn) {
        console.error("Element not found!");
        return;
    }

    btn.addEventListener('click', sendOtp);
});

function sendOtp(e){
    e.preventDefault();
    const email=document.getElementById('email').value
    if(!email){
        alert('All Field Required')
        return
    } 
   const sbtn=document.getElementById('otpSendButton')
   sbtn.disabled=true;
   sbtn.innerText='sending.......'

    fetch("http://localhost:3000/api/user/sendOtp", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
           email:email
        })
    })
    .then(response => response.json())
    .then(data => {
       alert(data.message)
    })
    .catch(error => {
        console.error("Error:", error);
    });
    sbtn.innerText='sent'
    const container = document.getElementById('formContainer');

    function addInputBox() {
        // Create a new div with a class
        const newDiv = document.createElement('div');
        newDiv.classList.add('input-container'); // Adding class
        newDiv.style.margin = '10px';
        newDiv.style.padding = '10px';
        newDiv.style.border = '1px solid #ccc';
    
    
    
        // Create an input box
        const inputBox = document.createElement('input');
        inputBox.type = 'text';
        inputBox.required=true;
        inputBox.name = 'userInput';
        inputBox.placeholder = 'Enter text';
        inputBox.style.marginRight = '10px';
    
        // Create a submit button
        const button = document.createElement('button');
        button.type = 'submit';
        button.textContent = 'Submit';
        button.onclick=function (event){
           

        }
    
        // Append input and button to form
        newDiv.appendChild(inputBox);
        newDiv.appendChild(button);
    
      
    
        // Insert the new div inside the container
        container.insertAdjacentElement('beforeend', newDiv);
    }
    
    // Call function to add input box
    addInputBox();
    
    
}





