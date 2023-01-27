import {Goal} from "./types";

export default class LoginData {
    static loggedIn = false
    static accessToken = ''
    static username = ''
    static goals: Goal[] = []
    static id: number = 0

    static Login(accessToken: string, username: string, goals: Goal[], id: number){
        this.loggedIn = true
        this.accessToken = accessToken
        this.username = username
        this.goals = goals
        this.id = id

        sessionStorage.setItem("accessToken", this.accessToken)
        sessionStorage.setItem("username", this.username)
        sessionStorage.setItem("goals", JSON.stringify(this.goals))
        sessionStorage.setItem("id", this.id.toString())
    }

    static Logout(){
        this.loggedIn = false
        this.accessToken = ''
        this.username = ''
        this.goals = []
        
        sessionStorage.removeItem("accessToken")
        sessionStorage.removeItem("username")
        sessionStorage.removeItem("goals")
        sessionStorage.removeItem("id")
    }

    static isLoggedIn() {
        return this.loggedIn
    }

    static getAccessToken() {
        return this.accessToken
    }

    static setAccessToken(token: string) {
        this.accessToken = token
        sessionStorage.setItem("accessToken", LoginData.accessToken);
    }

    static getUsername() {
        return this.username
    }

    static getGoals() {
        return this.goals
    }
    
    static addGoal(goal: Goal) {
        this.goals.push(goal)
        sessionStorage.setItem("goals", JSON.stringify(LoginData.goals));
    }

    static getUserID() {
        return this.id
    }

    static getStorage() {
        if (this.loggedIn) return

        this.accessToken = sessionStorage.getItem("accessToken") || ''
        this.username = sessionStorage.getItem("username") || ''
        this.goals = JSON.parse(sessionStorage.getItem("goals") || '{}')
        this.id = parseInt(sessionStorage.getItem("id") || '0')

        if(this.accessToken && this.username && this.goals && this.id) {
            this.loggedIn = true
        }
    }
}