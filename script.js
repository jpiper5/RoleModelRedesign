//global use strict
"use strict";

//light/dark mode toggle
function darkMode() {
    document.querySelector("body").classList.toggle("darkMode");
 }

//for tabs in tour section
$( "#tabs" ).tabs();

//changes color of active tab to match rest of table
$(document).ready(function() {

    //removes active class of currently selected tab when a new tab 'a' is clicked
    $("#tourList li a").click(function() {
        $("#tourList li.active").removeClass("active");

        //adds active class to the parent li of the 'a' that was clicked
        let $parentLi = $(this).parent();
        $parentLi.addClass("active");
    });
});

//loads content from json file
function getMerch() {

    //my endpoint from postman server
    let myEndpoint = "https://82418619-325c-46d3-af72-cad20a7e636f.mock.pstmn.io///merch";
    let endpoint = `${myEndpoint}`;
    
    //creates a XMLHttpRequest object
    let xhr = new XMLHttpRequest();

    //when the page loads this displays the data from my json file
    xhr.addEventListener("load", function(data) {
        if(this.status === 200) {
            displayMerch(this.response);
        }else{

            //displays error message if the endpoint is incorrect
            document.getElementById("merch").innerHTML = "<p>Check your endpoint and try again.</p>";
        }
    });

    //sets the expected response type
    xhr.responseType = "json";

    //opens a connection to the endpoint
    xhr.open("GET", endpoint);

    //sends the request to my server
    xhr.send();
}

//if the data from my json file successfully returns, this formats the data 
function displayMerch(data) {
    console.log(data);
    let string = "";

    //displays the data for each product semantically in my merch section
    for(let merch of data){
        string +=
        `<section>
        <img src ="${merch.image}" alt="${merch.alt}">
        <h3>${merch.name}</h3>
        <p>${merch.price}</p>
        <a>${merch.purchase}</a>
        </section>`;
    }
    document.getElementById("merch").innerHTML += string;
}

//slideshow for music videos
let $slideshow = $(".cycle-slideshow");

//when the prev button is clicked this moves the carousel back one to the previous video 
$("#prevBtn").on("click", function() {
   $slideshow.cycle("prev");
});

//when the prev button is clicked this advances the carousel to the next video
$("#nextBtn").on("click", function() {
   $slideshow.cycle("next");
});

//this creates a new user when their information is submitted in the form
function createUser(e){

	//prevent default form submission
	e.preventDefault();
	
	//form inputs as objects
	let nameInput = document.getElementById("fullName");
	let emailRadio = document.getElementById("prefEmail");
    let phoneRadio = document.getElementById("prefPhone");
	let emailInput = document.getElementById("myEmail");
	let phoneInput = document.getElementById("myPhone");
    let commentInput = document.getElementById("comments");
	
	//error message spans
	let errorSpans = document.querySelectorAll("#contact .message");
	
	//modal to confirm if the user wants to add a different user to storage once they already have one saved
	let modal = document.getElementById("modal");
	
	//clear out previous error messages/styles
	nameInput.classList.remove("errorInput");
    emailRadio.classList.remove("errorInput");
    phoneRadio.classList.remove("errorInput");
    emailInput.classList.remove("errorInput");
    phoneInput.classList.remove("errorInput");
    commentInput.classList.remove("errorInput");
    
    //resets error message displays
    errorSpans.forEach(function(span) {
      span.classList.remove("error");
    });
    
	//boolean for tracking validity of the form
	let isValid = true;
	
	//regular expressions for validation
    let fullNameRegex = /(^[A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})/;
    let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    let phoneRegex = /^(1-)?\d{3}-\d{3}-\d{4}$/;
    
    //validates name matches regex and isn't blank
    if (nameInput.value === "" || !(fullNameRegex.test(nameInput.value))) {
      
      //adds errorInput class if name isn't valid
      nameInput.classList.add("errorInput");
      
      //adds error message
      errorSpans[0].classList.add("error");
 
      //sets form validation variable to false
      isValid = false;
    }
 
    //validates email matches regex and isn't blank when email radio button is selected
    if (emailRadio.checked && (emailInput.value === "" || !(emailRegex.test(emailInput.value)))) {
 
          //adds errorInput class to radio button if email isn't valid  
          emailRadio.classList.add("errorInput");
 
          //adds errorInput class to email input if email isn't valid
          emailInput.classList.add("errorInput");
        
          //adds error message
          errorSpans[1].classList.add("error");
            
          //sets form validation variable to false
          isValid = false;
 
       //if phone radio button is selected this validates phone number matches regex and isn't blank
       } else  if (phoneRadio.checked && (phoneInput.value === "" || !(phoneRegex.test(phoneInput.value)))) {
 
          //adds errorInput class to phone radio button if phone isn't valid
          phoneRadio.classList.add("errorInput");
 
          //adds errorInput class to phone input if phone isn't valid
          phoneInput.classList.add("errorInput");
        
          //adds error message
          errorSpans[2].classList.add("error");
          
          //sets form validation variable to false
          isValid = false;
       }
 
    //validates comments aren't blank
    if (commentInput.value === "") {
 
       //adds errorInput class if comments isn't valid
       commentInput.classList.add("errorInput");
        
      //adds error message
      errorSpans[3].classList.add("error");
      
      //sets form validation variable to false
      isValid = false;
    }
	
	//if the form is valid this creates the user object
	if(isValid){

		//the user object
		let user = {};
		
		//the user object if the user's preference is email
		if(emailRadio.checked){
			user = {
				name: nameInput.value,
				contactPref: "email",
				email: emailInput.value,
				phone: phoneInput.value,
                comments: commentInput.value
			};

        //the user object if the user's preference is phone
		}else{
			user = {
				name: nameInput.value,
				contactPref: "phone",
				email: emailInput.value,
				phone: phoneInput.value,
                comments: commentInput.value
			};
		}
		
		//this checks to see if there is a user in storage already
		if(localStorage.getItem("newUser")){ 
			
			//displays the modal that asks if they want to replace the user already in storage or add a new one
			modal.classList.remove("hidden");
			
			//if they click confirm the old user is replaced with the new one
			document.getElementById("confirm").addEventListener("click", function(){
				
				//stringifys the json
				let userString = JSON.stringify(user);
				
				//removes the original object from storage
				localStorage.removeItem("newUser");
				
				//writes the new object to storage
				localStorage.setItem("newUser", userString);
				
				//hides the modal
				modal.classList.add("hidden");
				
				//displays the user to the page
				displayUser();
				
				//resets the form
				nameInput.value = "";
			    emailRadio.checked = true;
			    phoneRadio.checked = false;
			    emailInput.value = "";
			    phoneInput.value = "";
                commentInput.value = "";
			});
			
			//if they click cancel this hides the modal and leaves the new information in the form
			document.getElementById("cancel").addEventListener("click", function(){
				
				//hides the modal
				modal.classList.add("hidden");
				
			});
			
        //if there is no user in storage this will add one
		}else{
			
			//stringify the json
			let userString = JSON.stringify(user);

			//writes the string to storage
			localStorage.setItem("newUser", userString);
			
			//displays the user to the screen 
			displayUser();
			
			//resets the form
			nameInput.value = "";
			emailRadio.checked = true;
			phoneRadio.checked = false;
			emailInput.value = "";
			phoneInput.value = "";
            commentInput.value = "";
		}
	}
}


//displays user to the screen
function displayUser(){

	//checks to see if there is a user object in storage
	if(localStorage.getItem("newUser")){ 
		
		//gets the paragraph on the page to display the output
		let outputP = document.getElementById("objectDisplay");
		
		//string for building output
		let output = "";
		
		//gets the user from storage
		let userString = localStorage.getItem("newUser");
		
		//parse the string into JSON
		let user = JSON.parse(userString);
		
		//displays information on the screen depending on their contact preference
		if(user.contactPref == "email") {
			output += `<strong>Welcome Back!</strong><br>${user.name}<br>${user.email}<br>Comments: ${user.comments}`;
		} else {
			output += `<strong>Welcome Back!</strong><br>${user.name}<br>${user.phone}<br>Comments: ${user.comments}`;
		}
		
		//displays object properties to the page
		outputP.innerHTML = output;
	}
}


//event handlers

//for dark mode button
document.getElementById("darkMode").addEventListener("click", darkMode);

//for merch and displaying user for form when the page loads
window.onload = function(){
	getMerch();
    displayUser();
};

//for creating a user after submitting the form
document.getElementById("submitBtn").addEventListener("click", createUser);

