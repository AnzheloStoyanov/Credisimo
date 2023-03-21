class User {
    constructor(user, pass) {
      this.username = user;
      this.pass = pass;
  
      this.monthlyIncome = null;
      this.currentOwnedMoney =JSON.parse(localStorage.getItem('isThereUser'))? JSON.parse(localStorage.getItem('isThereUser')).currentOwnedMoney:Math.floor(Math.random() * 900);

      this.loans = [];
      this.loanApplications = [];
  
      setInterval(() => {
        let currentOwnedMoney=document.getElementById("currentlyOwnedMoney")
        this.currentOwnedMoney += Number(this.monthlyIncome);
        currentOwnedMoney.innerText=this.currentOwnedMoney.toFixed(2)+"лв"

        
        localStorage.setItem('isThereUser', JSON.stringify( vierControler.userManager.loggedUser));
        localStorage.setItem('Users', JSON.stringify( vierControler.userManager.users));

        if(this.loans.length){

            this.loans.forEach(element => {
                if (element.term) {
                    element.term--;
                    this.currentOwnedMoney -= element.monthlyPayment;
                    currentOwnedMoney.innerText = this.currentOwnedMoney + "лв"
                }
                
                localStorage.setItem('isThereUser', JSON.stringify( vierControler.userManager.loggedUser));
                if(element.term===0){
                    this.loans.splice(element,1)
                    localStorage.setItem('isThereUser', JSON.stringify( vierControler.userManager.loggedUser));

                }
            });
        }
        vierControler.userManager.users.forEach(element => {
            element.currentOwnedMoney+=Number(element.monthlyIncome);
            if(element.loans.length){
                element.loans.forEach(loan => {
                    element.currentOwnedMoney-=loan.monthlyPayment;
                    loan.term--;
                    localStorage.setItem('Users', JSON.stringify( vierControler.userManager.users));

                    localStorage.setItem('Users', JSON.stringify( vierControler.userManager.users));
                    if(loan.term===0){
                        element.loans.splice(loan,1)
                       localStorage.setItem('Users', JSON.stringify( vierControler.userManager.users));
                    }
               });
            }
        });
      }, 30000);
    }
  
    applyForLoan=(amount, term)=> {
      const loanApplication = new LoanApplication(amount, term);
      this.loanApplications.push(loanApplication);
  
      // Set a timeout to evaluate the loan application after 60 seconds
      setTimeout(() => {
        this.evaluateLoanApplication(loanApplication);
      }, 10000);
  
      return loanApplication;
    }
  
    
    evaluateLoanApplication=(loanApplication)=> {
        let isApproved = null
        if(loanApplication.amount<this.monthlyIncome*12){
            isApproved=true;
        }else if(loanApplication.amount>=this.monthlyIncome*6 &&
                 loanApplication.amount<=this.monthlyIncome*12 &&
                 loanApplication.term<=24 ){
                 isApproved=true;

        }
    
        if (isApproved) {
          loanApplication.status = LOAN_STATUS_APPROVED;
    
          const offers = [];
          const numOffers = Math.floor(Math.random() * 3) + 1;
          for (let i = 0; i < numOffers; i++) {
            let result=calculator(this.monthlyIncome, loanApplication.amount,loanApplication.term)
            const interestRate = result.interestRate;
            const loanAmount=Number(loanApplication.amount)
            const loanTerm = loanApplication.term;
            const monthlyPayment =Number(result.monthlyInstallment)
    
            offers.push({
              interestRate,
              loanAmount,
              loanTerm,
              monthlyPayment,
            });
          }
    
          loanApplication.offers = offers;
        } else {
          loanApplication.status = LOAN_STATUS_REJECTED;
        }

        vierControler.userManager.users.forEach(element => {
            if(element.username===vierControler.userManager.loggedUser.username){
               vierControler.userManager.loggedUser.loanApplications= element.loanApplications
            }
        });
        localStorage.setItem('isThereUser', JSON.stringify( vierControler.userManager.loggedUser));
        localStorage.setItem('Users', JSON.stringify(vierControler.userManager.users));
        vierControler.renderApplicationsPage()
      }
    
  
    takeLoanOffer=(loanApplication, offer)=> {
        return new Promise((resolve, reject) => {
            const loan = new Loan(
                offer.monthlyPayment,
                offer.loanAmount,
                offer.loanTerm,
                offer.interestRate
              );
              this.loans.push(loan);
              this.loanApplications = this.loanApplications.filter(
                (application) => application !== loanApplication
              );
              // Store the loan information in localStorage
              localStorage.setItem('Users', JSON.stringify(vierControler.userManager.users));
          
              resolve(loan) ;
            })

        }
      
  }

 



class UserManager {

    // constructor get's called every time when we create a new instance 
    constructor() {
     
        let loggedUser = JSON.parse(localStorage.getItem('isThereUser'));
      
         if(loggedUser) {
           this.loggedUser = new User(loggedUser.username, loggedUser.pass);
         }
       
       
    }

    loggedUser = JSON.parse(localStorage.getItem('isThereUser'));

    users = JSON.parse(localStorage.getItem('Users'))? JSON.parse(localStorage.getItem('Users')):[];
   


    login = ({ username, pass }) => {
        return new Promise((resolve, reject) => {
          let foundUser = this.users.find(user => user.username === username && user.pass === pass);
      
          if (foundUser) {
            this.loggedUser = foundUser;
            localStorage.setItem('isThereUser', JSON.stringify(this.loggedUser));
            resolve(true);
          } else {
            reject(false);
          }
        });
      };
   
    register = ({ username, pass }) => {
        return new Promise((resolve, reject) => {
          let foundUser = this.users.find(user => user.username === username);
          console.log(!foundUser)
      
          if (!foundUser) {
            let arrayOfUsers = this.users;
            
            localStorage.setItem("users", JSON.stringify({username,pass}));
            arrayOfUsers.push(new User(JSON.parse(localStorage.getItem('users')).username,
                                       JSON.parse(localStorage.getItem('users')).pass));
            localStorage.setItem("Users", JSON.stringify(arrayOfUsers))
            console.log(JSON.parse(localStorage.getItem('Users')))
      
            resolve(true);
          } else {
            resolve(false);
          }
        });
      }



}
