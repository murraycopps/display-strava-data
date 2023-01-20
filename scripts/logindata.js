export default class LoginData {
    static loggedIn = false
    static accessToken = ''
    static username = ''

    static Login( accessToken, username ){
        this.loggedIn = true
        this.accessToken = accessToken
        this.username = username
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
}