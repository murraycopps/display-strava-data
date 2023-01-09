export default class LoginData {
    static loggedIn = false
    static accessToken = ''

    static Login( token ){
        this.loggedIn = true
        this.accessToken = token
    }

    static isLoggedIn(){
        return this.loggedIn
    }

    static getAccessToken(){
        return this.accessToken
    }

    

    
}