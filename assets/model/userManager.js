class User {
    constructor(user, pass) {
        this.username = user;
        this.pass = pass;
    }
}

class UserManager {

    // constructor get's called every time when we create a new instance 
    constructor() {
     
        let loggedUser = JSON.parse(localStorage.getItem('isThereUser'));
      
        // if(loggedUser) {
        //     this.loggedUser = new User(loggedUser.username, loggedUser.pass);
        //     this.loggedUser.adopptedManager=new AdopptedManager();
        //     this.loggedUser.donateManager=new DonateManager()
           
        // }
       
    }

    loggedUser = JSON.parse(localStorage.getItem('isThereUser'));

    users = JSON.parse(localStorage.getItem('Users'))||[];
   



    login = ({ username, pass }) => {
        let foundUser = this.users.find(user => user.username === username &&
            user.pass === pass
        );
        if (foundUser) {
            this.loggedUser = foundUser;
            localStorage.setItem('isThereUser', JSON.stringify(this.loggedUser));
            
            return true;
        }

        return false;
    }
    
    register = ({ username, pass }) => {
        let foundUser = this.users.find(user => user.username === username);

        if (!foundUser) {
            let arrayOfUsers = this.users;
            
            localStorage.setItem("users", JSON.stringify({username,pass}));
            arrayOfUsers.push(new User(JSON.parse(localStorage.getItem('users')).username,
                                       JSON.parse(localStorage.getItem('users')).pass));

                arrayOfUsers.forEach(element => {
                // element.adopptedManager=new AdopptedManager() ;
                // element.donateManager=new DonateManager();
           
                
            });

            localStorage.setItem("Users", JSON.stringify(arrayOfUsers))
            console.log(JSON.parse(localStorage.getItem('Users')))

            
            return true;
        }

        return false;

    }


}
