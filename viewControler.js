class ViewControler {
    constructor() {
        window.addEventListener("load", this.handelHesh);
        window.addEventListener("hashchange", this.handelHesh);
        this.userManager=new UserManager()
     
     

    
    }

    handelHesh = () => {
        const hashIds = ["registerPage", "loginPage", "homePage", "applicationsPage"];
        let hashPage = window.location.hash.slice(1) || "loginPage";

        if (hashPage === "homePage" ||hashPage === "adopdetPage" ) {
            if (!this.userManager.loggedUser) {
                window.location.hash = "loginPage";
                return;
            }
        }

        if(this.userManager.loggedUser){
            let loginLink=document.getElementById("loginLink");
            loginLink.innerText="Излез"
            let form=document.getElementById('loginForm')
            form.style.display="none"
            // let button=document.getElementById("logout")
            //  button.style.display="block"
           
            // button.addEventListener("click", ()=>{
            //     this.userManager.loggedUser=null;
            //     localStorage.setItem('isThereUser', JSON.stringify(this.userManager.loggedUser));
            //     button.style.display="none";
            //     form.style.display="flex"
            //     loginLink.innerText="Login"

                
            // })
         

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
            let successfulLogin = this.userManager.login({ username, pass });
            if (successfulLogin) {
                window.location.hash = "homePage";
                
                errorMessage.style.display="none"
            }else{
                errorMessage.style.display="block";
            }
            
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
                case 4: let successfulRegistration = this.userManager.register({ username, pass });
                        if(!successfulRegistration ){
                            error.style.display="block";
                            errorContentRegister.innerText= "Този username е зает!"
                        }else{
                            window.location.hash = "loginPage";
                        }
                    break;
    
            }
        });

        error.addEventListener("click", ()=>{
            error.style.display="none"
        })

    }
    renderHomePage=()=>{
        let incomeSum=document.getElementById("incomeSum")
        let valueOfSumUWant=document.getElementById("valueOfSumUWant")
        let periodMonths=document.getElementById("periodMonths")

        let sumRange=document.getElementById("sumRange")
        let incomeSumRange=document.getElementById("incomeSumRange");
        incomeSumRange.addEventListener("input",(event)=>{
            incomeSum.innerHTML="";
            incomeSum.innerText=event.target.value+ "лв"
            valueOfSumUWant.innerText=sumRange.value +"лв"


        })

        

        sumRange.addEventListener("input",(event)=>{
            valueOfSumUWant.innerHTML="";
            valueOfSumUWant.innerText=event.target.value+ "лв"
        })

        let periodRange=document.getElementById("periodRange")

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
        })
        

       
    }

    
     

    


}
let vierControler = new ViewControler()
