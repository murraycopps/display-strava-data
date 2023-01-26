export default class LoginData {
    static loggedIn = false
    static accessToken = ''
    static username = ''
    static goals = []

    static Login( accessToken, username, goals ){
        this.loggedIn = true
        this.accessToken = accessToken
        this.username = username
        this.goals = goals
    }

    static isLoggedIn(){
        return this.loggedIn
    }

    static getAccessToken(){
        return this.accessToken
    }

    static setAccessToken(token){
        this.accessToken = token
    }  

    static getUsername(){
        return this.username
    }

    static getGoals(){
        return this.goals
    }
}