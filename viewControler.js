class ViewControler {
    constructor() {
        window.addEventListener("load", this.handelHesh);
        window.addEventListener("hashchange", this.handelHesh);
        this.userManager=new UserManager()
    }

    handelHesh = () => {
        const hashIds = ["registerPage", "loginPage", "homePage", "applicationsPage", "loansPage", "BOI"];
        let hashPage = window.location.hash.slice(1) || "loginPage";
        let currentOwnedMoney=document.getElementById("currentlyOwnedMoney")
        let loginForm= document.getElementById("loginForm");
        let logout= document.getElementById("logout");

        if (hashPage === "homePage" ||hashPage === "applicationsPage"||
            hashPage === "loansPage" ) {
            if (!this.userManager.loggedUser) {
                window.location.hash = "loginPage";
                currentOwnedMoney.style.display="none"
                logout.style.display="none"
                loginForm.style.display="flex"

                return;
            }

        }
        
    

        if(this.userManager.loggedUser){
           
            loginForm.style.display="none"
            logout.style.display="flex"

            
            let loginLink=document.getElementById("loginLink");
            loginLink.innerText="Излез"
            let form=document.getElementById('loginForm')
            form.style.display="none"

            currentOwnedMoney.innerText=this.userManager.loggedUser.currentOwnedMoney.toFixed(2)+"лв";
            if(this.userManager.loggedUser.currentOwnedMoney>1000){
                currentOwnedMoney.style.color="#00f700"
                currentOwnedMoney.classList.remove("currentOwnedMoney")

            }else{
                currentOwnedMoney.style.color="#fb1010"
                currentOwnedMoney.classList.add("currentlyOwnedMoney")
            
            } 


            if(this.userManager.loggedUser.currentOwnedMoney<=0){
            window.location.hash="BOI"
            let BOI=document.getElementById("BOI")
            BOI.style.display="flex";
             }
            if(this.userManager.loggedUser.currentOwnedMoney>1000){
                currentOwnedMoney.style.color="#00f700"
            }else{
                currentOwnedMoney.style.color="#fb1010"
                
            }
            let button=document.getElementById("logout")
             button.style.display="block"
           
            button.addEventListener("click", ()=>{
                this.userManager.loggedUser=null;
                localStorage.setItem('isThereUser', JSON.stringify(this.userManager.loggedUser));
                button.style.display="none";
                form.style.display="flex"
                loginLink.innerText="Login"

                
            })
            
         

        }

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


        switch (hashPage) {
            case "homePage":this.renderHomePage();
            document.getElementById("moneyInputName").placeholder=this.userManager.loggedUser.username;
             break;
             case "loginPage": this.renderLogin();
             break;
             case  "registerPage": this.renderRegister();  
             break;  
             case "applicationsPage" : this.renderApplicationsPage();
             break
             case "loansPage" : this.renderLoansPage();
             break;

         }

    }
    renderLogin = () => {
        let form = document.getElementById('loginForm');
        let errorMessage=document.getElementById("errorMessage");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            let username = e.target.elements.username.value;
            console.log(username)
            let pass = e.target.elements.pass.value;
            let successfulLogin = this.userManager.login({ username, pass })

             .then((success) => {
                if (success) {
                    window.location.hash = "homePage";
                    errorMessage.style.display="none"
                    window.location.hash = "homePage";
                setTimeout(() => {
                    document.location.reload();
                  }, 1);
                } 
              })
              .catch((error) => {
                errorMessage.style.display="block"
              });
            

                
            // if (successfulLogin) {
            //     window.location.hash = "homePage";
                
            //     errorMessage.style.display="none"
            // }else{
            //     errorMessage.style.display="block";
            // }
            
        });
        let errorMessageBtn=document.getElementById("errorMessageBtn");
        errorMessageBtn.addEventListener("click", ()=>{
            errorMessage.style.display="none"
        })
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
        let error=document.getElementById("errorMessagRegister");

        form.addEventListener("submit", (e)=>{
            e.preventDefault();
            let username = e.target.elements.username.value.trim();
            let pass = e.target.elements.pass.value.trim();
            let repeatPass = e.target.elements.repeatPass.value.trim();
            let checkCredentials=this.checkingCredentials(username, pass, repeatPass);
           let errorContentRegister=document.getElementById("errorContentRegister")

            switch (checkCredentials) {
                case 1:  error.style.display="block";
                errorContentRegister.innerText= "Паролата Ви за потвърждение не отговаря на зададената парола!"
                    break;
                case 2:error.style.display="block";
                errorContentRegister.innerText= "Попълнете задължителните полета за да продължите!"
                    break;
                case 3: error.style.display="block";
                errorContentRegister.innerText= "Паролата Ви трябва да съдържа поне 8 букви, със символ, главни и малки букви и цифра"
                    break;
                case 5: error.style.display="block";
                errorContentRegister.innerText= "Няма как да имаш такова има брат!"
                    break;
                case 4: this.userManager.register({ username, pass }) 
                .then((success) => {
                    if (success) {
                        window.location.hash = "loginPage";
                    } else {
                        error.style.display="block";
                        errorContentRegister.innerText= "Този username е зает!"
                    }
                  })
                  .catch((error) => {
                    console.log("Error registering user:", error);
                  });
                    break;
    
            }
        });

        error.addEventListener("click", ()=>{
            error.style.display="none"
        })

    }
    renderHomePage=()=>{
        this.userManager.users = JSON.parse(localStorage.getItem('Users'))
        this.userManager.loggedUser.loanApplications=JSON.parse(localStorage.getItem('isThereUser')).loanApplications
        this.userManager.loggedUser.monthlyIncome=JSON.parse(localStorage.getItem('isThereUser')).monthlyIncome;

        let incomeSum=document.getElementById("incomeSum")
        incomeSum.innerText=this.userManager.loggedUser.monthlyIncome?this.userManager.loggedUser.monthlyIncome:1000
        let valueOfSumUWant=document.getElementById("valueOfSumUWant")
        let periodMonths=document.getElementById("periodMonths")

        let sumRange=document.getElementById("sumRange")
        let incomeSumRange=document.getElementById("incomeSumRange");
        incomeSumRange.value=this.userManager.loggedUser.monthlyIncome?this.userManager.loggedUser.monthlyIncome:1000
        let periodRange=document.getElementById("periodRange")

        incomeSumRange.addEventListener("input",(event)=>{
            incomeSum.innerHTML="";
            incomeSum.innerText=event.target.value+ "лв"
            valueOfSumUWant.innerText=sumRange.value +"лв"
            this.userManager.loggedUser.monthlyIncome=event.target.value;

            this.userManager.users.forEach(element => {
                if (element.username === this.userManager.loggedUser.username) {
                    element.monthlyIncome = this.userManager.loggedUser.monthlyIncome
                }
            });
            localStorage.setItem("Users", JSON.stringify(this.userManager.users))

            localStorage.setItem('isThereUser', JSON.stringify(this.userManager.loggedUser));
        })        

        sumRange.addEventListener("input",(event)=>{
            valueOfSumUWant.innerHTML="";
            valueOfSumUWant.innerText=event.target.value+ "лв"
        })


        periodRange.addEventListener("input",(event)=>{
            periodMonths.innerHTML="";
            periodMonths.innerText=event.target.value+ "месеца"
        })

     
        let moneyForm=document.getElementById("moneyForm")
        moneyForm.addEventListener("input",(event)=>{
            event.preventDefault()
            let period=event.currentTarget.period.value
            let money=event.currentTarget.money.value
            let income=event.currentTarget.income.value
        
           let result= calculator(income,money,period);
            let creditAmouthValue = document.getElementById("creditAmouthValue") 
            creditAmouthValue.innerText="Лихва "+result.interestRate +"%";
            if(result.interestRate<=7){
                sumRange.max=50000
            }else  if(result.interestRate<=9){
                sumRange.max=100000
            }else if(result.interestRate<=11){
                sumRange.max=150000
            }
            let creditAmouthInterest = document.getElementById("creditAmouthInterest")        
            creditAmouthInterest.innerText=result.monthlyInstallment+"лв"
        });
        moneyForm.addEventListener("submit", (event)=>{
            event.preventDefault();
           let money=Number(event.currentTarget.money.value)
           let period=Number(event.currentTarget.period.value)
        this.userManager.loggedUser.applyForLoan(money,period)
        localStorage.setItem('isThereUser', JSON.stringify(this.userManager.loggedUser))

        this.userManager.users.forEach(element => {
            if (element.username === this.userManager.loggedUser.username) {
                element.loanApplications = this.userManager.loggedUser.loanApplications
            }
        });

        localStorage.setItem('Users', JSON.stringify(this.userManager.users))
        window.location.hash = "applicationsPage";
        
        })
        

       
    }
    renderApplicationsPage=()=>{
        this.userManager.loggedUser.loanApplications=JSON.parse(localStorage.getItem('isThereUser')).loanApplications
        this.userManager.loggedUser.loans=JSON.parse(localStorage.getItem('isThereUser')).loans
        this.userManager.loggedUser.monthlyIncome=JSON.parse(localStorage.getItem('isThereUser')).monthlyIncome
        this.userManager.loggedUser.currentOwnedMoney=JSON.parse(localStorage.getItem('isThereUser')).currentOwnedMoney
        
        let offersContainer= document.getElementById("offersContainer");
       offersContainer.innerHTML=""
        this.userManager.loggedUser.loanApplications.forEach(aplication => {
           let tr= document.createElement("tr");
            if(aplication.status==="Одобрен"){
                tr.classList.add("statsOkay")
            }else if (aplication.status==="Изчакване"){
                tr.classList.add("statusLate")
            }else{
                tr.classList.add("statsCanceled")
            }

            let thScop=document.createElement("th")
            thScop.scope="row"
            thScop.innerText=aplication.id

            let wantedSum =document.createElement("td")
            wantedSum.innerText=aplication.amount;

            let term=document.createElement("td")
            term.innerText=aplication.term;

            let status=document.createElement("td");
            status.innerText=aplication.status;
            status.classList.add("status");
            let someThing=document.getElementById("someThing")
            status.addEventListener("click",()=>{
                if(aplication.status==="Oдобрен"){
                    someThing.style.display="flex";
                    waitingForSuccess.style.display="none"
                    callToActon.style.display="flex"

                }else if(aplication.status==="Изчакване"){
                    someThing.style.display="flex"
                    waitingForSuccess.style.display="flex"
                    callToActon.style.display="none"
                }
            })

            let tdBtn=document.createElement("td");
            tdBtn.classList.add("tdBtn");
            let btn=document.createElement("button")
            if(aplication.status!=="Изчакване"){
                if(aplication.status==="Одобрен"){
                    btn.classList.add("lookBtn");
                    btn.addEventListener("click",()=>{
                        let goodNewsOffer= document.getElementById("goodNewsOffer")
                        goodNewsOffer.innerHTML=""
                        let acceptedContainer=document.getElementById("acceptedContainer")
                        acceptedContainer.style.display="flex";
                        let arrayOfClasses=["oferOne","oferTwo","oferThree"]

                        for(let i=0; i<aplication.offers.length;i++){
                            let offer=document.createElement("div")
                            offer.classList.add(arrayOfClasses[i]);

                            let interestRate=document.createElement("div")
                            interestRate.classList.add("interestRate");
                            interestRate.innerText="Лихва:";

                            let interestRateProcent=document.createElement("div")
                            interestRateProcent.classList.add("interestRateProcent");
                            interestRateProcent.innerText=aplication.offers[i].interestRate +"%";

                            
                            let loanTerm=document.createElement("div")
                            loanTerm.classList.add("loanTerm");
                            loanTerm.innerText="Срок:";

                            
                            let months=document.createElement("div")
                            months.classList.add("months");
                            months.innerText=aplication.offers[i].loanTerm +"месеца";

                            
                            let loanAmount=document.createElement("div")
                            loanAmount.classList.add("loanAmount");
                            loanAmount.innerText="Сума:";

                            let loanAmountValue=document.createElement("div")
                            loanAmountValue.classList.add("loanAmountValue");
                            loanAmountValue.innerText=aplication.offers[i].loanAmount +"лв";
                            
                            let monthlyPayment=document.createElement("div")
                            monthlyPayment.classList.add("monthlyPayment");
                            monthlyPayment.innerText="Месечна вноска:";

                            
                            let monthlyPaymentVelue=document.createElement("div")
                            monthlyPaymentVelue.classList.add("monthlyPaymentVelue");
                            monthlyPaymentVelue.innerText=aplication.offers[i].monthlyPayment +"лв";

                            let acceptBtn=document.createElement("button")
                            acceptBtn.classList.add("acceptBtn");
                            acceptBtn.innerText="Приеми";
                            acceptBtn.addEventListener("click", ()=>{
                                this.userManager.loggedUser.takeLoanOffer(aplication,aplication.offers[i]);
                                this.userManager.users.forEach(element => {
                                    if (element.username === this.userManager.loggedUser.username) {
                                        element.loans = this.userManager.loggedUser.loans
                                    }
                                });

                                localStorage.setItem('isThereUser', JSON.stringify(this.userManager.loggedUser));
                                localStorage.setItem('Users', JSON.stringify(this.userManager.users));
                                 this.renderApplicationsPage()
                                 acceptedContainer.style.display="none"
                            })


                            let rejectItBtn=document.createElement("button")
                            rejectItBtn.classList.add("rejectItBtn");
                            rejectItBtn.innerText="Откажи";

                            offer.append(interestRate,interestRateProcent, loanTerm, months ,loanAmount, loanAmountValue, monthlyPayment , monthlyPaymentVelue , acceptBtn, rejectItBtn )
                          goodNewsOffer.appendChild(offer);

                        }
                    })
                }else{
                    btn.classList.add("lookRefBtn");
                    btn.addEventListener("click",()=>{
                        someThingElse.style.display="flex"
                        
                    })
                }
                btn.innerText="Преглед"
            }else{
                btn.classList.add("refusBtn");
                btn.innerText="Отказ"
            }
           
            tdBtn.appendChild(btn);
            tr.append(thScop,wantedSum,term,status,tdBtn)
            offersContainer.appendChild(tr)
        });
        let closePopUpBtn =document.getElementById("closePopUpBtn");
        let badNewsCloseBtn=document.getElementById("badNewsCloseBtn");

        let closePopUpWaitingBtn=document.getElementById("closePopUpWaitingBtn")
        let someThing= document.querySelectorAll(".someThing");
        let status= document.querySelectorAll(".status")
        let goodNewsCloseBtn=document.getElementById("goodNewsCloseBtn")

        let waitingForSuccess=document.getElementById("waitingForSuccess");
        let callToActon=document.getElementById("callToActon");
        status.forEach(element => {
            element.addEventListener("click", ()=>{
                someThing[0].style.display="flex"
               
                if(element.innerText ==="Изчакване"){
                    waitingForSuccess.style.display="flex"
                    callToActon.style.display="none"
                }else if(element.innerText==="Oдобрен"){
                    waitingForSuccess.style.display="none"
                    callToActon.style.display="flex"
                }
            });
        });

        closePopUpBtn.addEventListener("click",()=>{
           someThing[0].style.display="none"
        });
        let someThingElse=document.getElementById("someThingElse")
        badNewsCloseBtn.addEventListener("click", ()=>{
            someThingElse.style.display="none";
        })
        closePopUpWaitingBtn.addEventListener("click",()=>{
            someThing[0].style.display="none";
            waitingForSuccess.style.display="none"

         });
         goodNewsCloseBtn.addEventListener("click", ()=>{
            let acceptedContainer=document.getElementById("acceptedContainer");
            acceptedContainer.style.display="none"
        })
         

    }


    renderLoansPage=()=>{
        this.userManager.loggedUser.loanApplications=JSON.parse(localStorage.getItem('isThereUser')).loanApplications
        this.userManager.loggedUser.loans=JSON.parse(localStorage.getItem('isThereUser')).loans
        this.userManager.loggedUser.monthlyIncome=JSON.parse(localStorage.getItem('isThereUser')).monthlyIncome
        this.userManager.loggedUser.currentOwnedMoney=JSON.parse(localStorage.getItem('isThereUser')).currentOwnedMoney
        let loansContainer =document.getElementById("loansContainer");
        loansContainer.innerHTML="";
    
        this.userManager.loggedUser.loans.forEach(loan => {
            let tr = document.createElement("tr");
            tr.classList.add("loansStatus");

            let th=document.createElement("th");
            th.scope="row";
            th.innerText=loan.interestRate;

            let sum=document.createElement("td");
            sum.innerText=loan.amount;

            let monthlyPayment=document.createElement("td");
            monthlyPayment.innerText=loan.monthlyPayment;

            let term=document.createElement("td");
            term.classList.add("timeloans")
            term.innerText=loan.term;

            let totalOwnedAmount=document.createElement("td");
            totalOwnedAmount.classList.add("loansAllAmount")
            totalOwnedAmount.innerText=loan.totalOwnedAmount;

            tr.append(th,sum,monthlyPayment,term,totalOwnedAmount);
            loansContainer.appendChild(tr)
      

        });

    }
}
let vierControler = new ViewControler()
