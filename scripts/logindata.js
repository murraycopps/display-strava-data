export default class LoginData {
    static loggedIn = false
    static accessToken = ''

    static Login( accessToken ){
        this.loggedIn = true
        this.accessToken = accessToken
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
}