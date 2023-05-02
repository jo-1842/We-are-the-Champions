import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"

import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    "databaseURL" : "https://we-are-the-champions-60473-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)

const endorsementsListInDB = ref(database, "endorsements")

/* html elements  */
const endorsementsCtrEl = document.getElementById("endorsements-ctr")
const publishBtn = document.getElementById("publish-btn")





publishBtn.addEventListener('click', function(){
   let inputValue = document.getElementById("text-area").value
   let fromInput = document.getElementById("from-input").value
   let toInput = document.getElementById("to-input").value
   let liked = false
   let likes = 0;

   if (inputValue && fromInput && toInput){
    push(endorsementsListInDB, {inputValue, fromInput, toInput, liked, likes})
    clearInput()
    
   } else {
        console.log("please fill in all fields")
   }
})


function clearInput() {
    document.getElementById("text-area").value = "";
    document.getElementById("from-input").value = "";
    document.getElementById("to-input").value = "";
}

onValue(endorsementsListInDB, manageValueChange)

function manageValueChange (snapshot) {
    if (snapshot.exists()){
        endorsementsCtrEl.innerHTML =""
        let inputEntries = Object.entries(snapshot.val())
        
        console.log(inputEntries)
        
        for (let i=0 ; i<inputEntries.length ; i++) {
            let inputKey = inputEntries[i][0];
            let inputValueObj = inputEntries[i][1];
            
            console.log(inputValueObj.fromInput)
            
            let inputEl = document.createElement("p")
            inputEl.classList.add("endorsement")
            inputEl.innerHTML = 
            `<strong> To ${inputValueObj.toInput}</strong> <br><br>
            ${inputValueObj.inputValue} <br><br>
            <div id="from-and-likes-ctr">
              <strong> From ${inputValueObj.fromInput} </strong>
              <div id="likes-ctr">
                <i class="fa-solid fa-heart" id="like-icon${inputKey}"></i>
                <span id="likes-count${inputKey}" class="likes-count"></span>
              </div>
            </div>  
             `
            inputValueObj.inputValue;
            endorsementsCtrEl.appendChild(inputEl)


        // manages the likes
           
        document.getElementById(`like-icon${inputKey}`).addEventListener("click", function(){
            console.log(`likes-count${inputKey}`, inputValueObj.liked )
            if (inputValueObj.liked === false){
                inputValueObj.likes++
                inputValueObj.liked = true
                
            }else {
                inputValueObj.likes--
                inputValueObj.liked = false
            }
            if(inputValueObj.likes >0){
                document.getElementById(`likes-count${inputKey}`).innerHTML= `<strong>${inputValueObj.likes}</strong>`;
            } else {
                document.getElementById(`likes-count${inputKey}`).innerHTML= "";
            }

        })

    } 

} else {
        endorsementsCtrEl.innerHTML = '<p class="endorsement"> No endorsements... yet</p>';
   }
    
}

