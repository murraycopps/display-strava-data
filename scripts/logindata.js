export default class LoginData {
    // static loggedIn = false
    // static accessToken = ''
    static loggedIn = false
    static accessToken = ''

    static Login( token ){
        this.loggedIn = true
        this.accessToken = token
        // load user data to cookie
    }

    static isLoggedIn(){
        // check if acess token is in cookies and if it is a valid strava token
        return this.loggedIn
    }

    static getAccessToken(){
        return this.accessToken
    }
    

    
}