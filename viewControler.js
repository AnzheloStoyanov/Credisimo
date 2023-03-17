class ViewControler {
    constructor() {
        window.addEventListener("load", this.handelHesh);
        window.addEventListener("hashchange", this.handelHesh);
     
     

    
    }

    handelHesh = () => {
        const hashIds = ["registerPage", "loginPage", "homePage"];
        let hashPage = window.location.hash.slice(1) || "loginPage";
        hashIds.forEach(id => {
            let page = document.getElementById(id);
            if (hashPage === id) {
                if(id==="homePage"){
                    page.style.display = "grid"
                }else{
                    page.style.display = "flex"
                }
              
            } else {
                page.style.display = "none"
            }
        });

         



    }

    renderCatd = (result,container) => {
            container.innerText=""
            result.forEach(animal => {

            let card = document.createElement("div")
            card.classList.add("card")

            let img = document.createElement("img");
            img.src = "./assets/images/"+animal.image;
            img.width = "200"
            img.classList.add("img")

            let name = document.createElement("div");
            name.innerText = animal.name;
            name.classList.add("name")

            let type = document.createElement("div");
            type.innerText = animal.type;
            type.classList.add("type")

            let bread = document.createElement("div");
            bread.innerText = animal.bread;
            bread.classList.add("bread")

            let age = document.createElement("div");
            age.innerText = animal.age;
            age.classList.add("age")

            let needSum = document.createElement("div");
            needSum.innerText =animal.neededAmount 
            needSum.classList.add("dateOn");

            let curretSum=document.createElement("div");
            curretSum.innerText =animal.currentlyRisedAmount 
            curretSum.classList.add("currentSum");

            // let inputDuner=document.createElement("input");
            // inputDuner.type="number";
            // inputDuner.value="1";
            // inputDuner.classList.add("inputDuner")

            let addopedBtn = document.createElement("button");
            addopedBtn.innerText="addoped"
            addopedBtn.classList.add("addopedBtn")
            addopedBtn.addEventListener("click", ()=>{
                this.userManager.loggedUser.adopptedManager.adoped(animal);

                let index = this.animalManager.animalList.findIndex(element => element.name === animal.name);
                this.animalManager.animalList.splice(index,1); 
                
                let locals=JSON.parse(localStorage.getItem('Users'))
               
                let animalsToDelete =[];

                for (let i = 0; i < locals.length; i++) {
                    let adoptedAnimalsLength=locals[i].adopptedManager.adoptedAnimals.length
                    for (let j = 0; j <adoptedAnimalsLength ; j++) {
                      console.log ( JSON.parse(localStorage.getItem('Users'))[i].adopptedManager.adoptedAnimals[j].name)
                      animalsToDelete.push(JSON.parse(localStorage.getItem('Users'))[i].adopptedManager.adoptedAnimals[j].name);

                    }
                  }
                 
                  
                  
                  
                  let  animlasUnadopted = this.animalManager.animalList.filter((element) => !animalsToDelete.includes(element.name));
                  


                console.log(animalsToDelete)
              
 

                localStorage.setItem('animalList', JSON.stringify(animlasUnadopted));
                JSON.parse(localStorage.getItem('animalList'));
              

 
               console.log(index);
              
                window.location.hash="adopdetPage"

              
            })
            
           

            let donateBtn = document.createElement("button");
            donateBtn.innerText="Donate"
            donateBtn.classList.add("donateBtn")
            
            donateBtn.addEventListener("click", ()=>{
                window.location.hash="donatePage"
                this.userManager.loggedUser.donateManager.currentDonate(animal);

                localStorage.setItem('isThereUser', JSON.stringify(this.userManager.loggedUser));
                let users=JSON.parse(localStorage.getItem('Users'));
                users.forEach(element => {
                    if(element.username===this.userManager.loggedUser.username){
                        element.donateManager.historyOfDonate=JSON.parse(localStorage.getItem('isThereUser')).donateManager.historyOfDonate
                    }
                    
                });

                localStorage.setItem('Users', JSON.stringify(users));
               

                console.log(animal)
            })
            if(Number(animal.currentlyRisedAmount)<Number(animal.neededAmount)){
                card.appendChild(donateBtn)
               
            }

            card.append(img, name, type, bread,age,addopedBtn,needSum?needSum:date,curretSum);
            container.appendChild(card)
           


        });

    }

   

    renderHomePage =()=>{
         

        let searchInput=document.getElementById("searchInput");
        let container = document.getElementById("container");

        let searchSelector=document.getElementById("select");
        searchSelector.name="searchSelector"
        const unique = this.animalManager.animalList.filter(
            (obj, index) =>
            this.animalManager.animalList.findIndex((item) => item.type === obj.type) === index
          );

            unique.forEach(element => {
            let option=document.createElement("option");
            option.innerText=element.type;
            option.value=element.type;
            searchSelector.appendChild(option)
        });
        document.getElementById("surchers").appendChild(searchSelector);


            searchSelector.addEventListener("change", (event)=>{
            let result =this.animalManager.searchS(event.target.value);
            console.log(event.target.value)
            this.renderCatd(result,container)

        });
        

        searchInput.addEventListener("input", (event)=>{
            let result =this.animalManager.searchF(event.target.value);
            console.log(result)
            this.renderCatd(result,container)
           
        })
        this.renderCatd(this.animalManager.animalList, container)

        
        
    }
     
     
    adopptedPage=()=>{
         let container=document.getElementById("containerAdopted")
         container.innerHTML=""
         
         this.userManager.loggedUser.adopptedManager.adoptedAnimals.forEach(animal => {

            let card = document.createElement("div")
            card.classList.add("card")

            let img = document.createElement("img");
            img.src = "./assets/images/"+animal.image;
            img.width = "200"
            img.classList.add("img")

            let name = document.createElement("div");
            name.innerText = animal.name;
            name.classList.add("name")

            let type = document.createElement("div");
            type.innerText = animal.type;
            type.classList.add("type")

            let bread = document.createElement("div");
            bread.innerText = animal.bread;
            bread.classList.add("bread")

            let age = document.createElement("div");
            age.innerText = animal.age;
            age.classList.add("age")

            let date=document.createElement("div");
            date.innerText=new Date().toLocaleDateString(); 
            date.classList.add("dateOn")

           
            let addopedBtn = document.createElement("button");
            addopedBtn.innerText="Leave"
            addopedBtn.classList.add("addopedBtn")
            addopedBtn.addEventListener("click", ()=>{
                
                this.animalManager.animalList.push(new Animals(animal.name, animal.image,animal.age, animal.type, animal.bread , animal.age , animal.neededAmount , animal.currentlyRisedAmount))
                
                // let index = this.userManager.loggedUser.adopptedManager.adoptedAnimals.findIndex(element=>element.name===animal.name); 
                // this.userManager.loggedUser.adopptedManager.adoptedAnimals.splice(index,1); 
                
                this.userManager.loggedUser.adopptedManager.leave(animal.name)

 
                
                window.location.hash="homePage"  
            })
            
         

            let donateBtn = document.createElement("button");
            donateBtn.innerText="donate"
            donateBtn.classList.add("donateBtn")

            card.append(img, name, type, bread,age,addopedBtn,date);
            container.appendChild(card)
           


        });

    }

    submitForm = (event) => {

        event.preventDefault();
        console.log(event.currentTarget);

        this.userManager.loggedUser.donateManager.donate(this.userManager.loggedUser.donateManager.curentAnimalDonate, event.currentTarget.sum.value);
        location.hash = "homePage"
    }



    renderDonatePage = () => {
        let nameOfanimal = document.getElementById("nameOfTheAnimal");
        nameOfanimal.innerText = "How much do you want to donate for " + this.userManager.loggedUser.donateManager.curentAnimalDonate.name
        let donateForm = document.getElementById("donateForm");
        donateForm.removeEventListener("submit", this.submitForm)
        donateForm.addEventListener("submit", this.submitForm)
        let historyList = document.getElementById("history");
        historyList.innerHTML = "";
    
        this.userManager.loggedUser.donateManager.historyOfDonate.forEach(element => {
           let box=document.createElement("div");
           box.style.display="flex";
           box.style.justifyContent="space-between";
           box.style.width="800px"
           let date=document.createElement("span");
           date.innerText= "Дата: "+ new Date().toLocaleDateString(); 
           let animalName=document.createElement("span");
           animalName.innerText="Име на животното: "+element.animalName
           let  donateSum=document.createElement("span");;
           donateSum.innerText="Дарени: " +element.donateSum + " лв."
           box.append(date, animalName,donateSum)
           historyList.appendChild(box)
        });
   


    }
    


    renderLogin = () => {
        let form = document.getElementById('loginForm');

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            let username = e.target.elements.username.value;
            let pass = e.target.elements.pass.value;
            let successfulLogin = this.userManager.login({ username, pass });
            let errorMessage=document.getElementById("errorMessage");
            if (successfulLogin) {
                window.location.hash = "homePage";
                setTimeout(() => {
                    document.location.reload();
                  }, 1);
                errorMessage.style.display="none"
            }else{
                errorMessage.style.display="block";
            }
            
        });
    }

    checkingCredentials=(user, password, repeatPassword)=>{
        const checkPassword = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        const checkUsername = /^[a-zA-Z0-9]+$/;
        if (password !== repeatPassword) {
            return 1
            //  alert("Паролата Ви за потвърждение не отговаря на зададената парола!")
        }else if (!user.match(checkUsername) || user.length < 5 || user.length > 15) {
            return 5
        }else if (!user || !password || !repeatPassword) {
            return 2
            //alert("Попълнете задължителните полета за да продължите!")
        } else if (!password.match(checkPassword)) {
            return 3
            //alert("Паролата Ви трябва да съдържа поне 8 букви, със символ, главни и малки букви и цифра")

        } else {
            return 4



        }

    }

    renderRegister= ()=>{
        let form = document.getElementById('registerForm');
        form.addEventListener("submit", (e)=>{
            e.preventDefault();
            let username = e.target.elements.username.value.trim();
            let pass = e.target.elements.pass.value.trim();
            let repeatPass = e.target.elements.repeatPass.value.trim();
            let checkCredentials=this.checkingCredentials(username, pass, repeatPass);
           let error=document.getElementById("errorMessagRegister")

            switch (checkCredentials) {
                case 1:  error.style.display="block";
                         error.innerText= "Паролата Ви за потвърждение не отговаря на зададената парола!"
                    break;
                case 2:error.style.display="block";
                        error.innerText= "Попълнете задължителните полета за да продължите!"
                    break;
                case 3: error.style.display="block";
                        error.innerText= "Паролата Ви трябва да съдържа поне 8 букви, със символ, главни и малки букви и цифра"
                    break;
                case 5: error.style.display="block";
                        error.innerText= "Няма как да имаш такова има брат!"
                    break;
                case 4: let successfulRegistration = this.userManager.register({ username, pass });
                        if(!successfulRegistration ){
                            error.style.display="block";
                            error.innerText= "Този username е зает!"
                        }else{
                            window.location.hash = "login";
                        }
                    break;
    
            }
        });
       


    }



}
let vierControler = new ViewControler()
