export default class LoginData {
    static loggedIn = false
    static accessToken = ''
    static username = ''
    static goals = []

    static Login(accessToken, username, goals) {
        this.loggedIn = true
        this.accessToken = accessToken
        this.username = username
        this.goals = goals

        sessionStorage.setItem("accessToken", LoginData.accessToken);
        sessionStorage.setItem("username", LoginData.username);
        sessionStorage.setItem("goals", JSON.stringify(LoginData.goals));
    }

    static Logout(){
        this.loggedIn = false
        this.accessToken = ''
        this.username = ''
        this.goals = []
        
        sessionStorage.removeItem("accessToken")
        sessionStorage.removeItem("username")
        sessionStorage.removeItem("goals")
    }

    static isLoggedIn() {
        return this.loggedIn
    }

    static getAccessToken() {
        return this.accessToken
    }

    static setAccessToken(token) {
        this.accessToken = token
        sessionStorage.setItem("accessToken", LoginData.accessToken);
    }

    static getUsername() {
        return this.username
    }

    static getGoals() {
        return this.goals
    }

    static getStorage() {
        if (this.loggedIn) return

        this.accessToken = sessionStorage.getItem("accessToken");
        this.username = sessionStorage.getItem("username");
        this.goals = JSON.parse(sessionStorage.getItem("goals"));

        console.log(!!this.accessToken, !!this.username, !!this.goals)

        if(this.accessToken && this.username && this.goals) {
            this.loggedIn = true
        }
    }
}