import axios from "axios";
import { Goal } from "./types";

export default class LoginData {
    static loggedIn = false
    static accessToken = ''
    static username = ''
    static goals: Goal[] = []
    static _id: string = ''

    static Login(accessToken: string, username: string, goals: Goal[], id: string) {
        this.loggedIn = true
        this.accessToken = accessToken
        this.username = username
        this.goals = goals
        this._id = id

        sessionStorage.setItem("accessToken", this.accessToken)
        sessionStorage.setItem("username", this.username)
        sessionStorage.setItem("goals", JSON.stringify(this.goals))
        sessionStorage.setItem("id", this._id)
    }

    static Logout() {
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

    static async updateGoals(url: string) {
        const { data } = await axios.get(`${url}/api/users`)
        const user = data.data.find((user: any) => user.username === this.username)
        this.goals = user.goals
        sessionStorage.setItem("goals", JSON.stringify(LoginData.goals))
    }

    static completeGoal(id: number, url: string) {
        this.goals = this.goals.map((goal) => {
            if (goal.id === id) {
                goal.completed = true
            }
            return goal
        })
        sessionStorage.setItem("goals", JSON.stringify(LoginData.goals))
        axios.put(`${url}/api/users`, {
            _id: this._id,
            goals: this.goals
        })
    }

    static deleteGoal(id: number, url: string) {
        this.goals = this.goals.filter((goal) => goal.id !== id)
        sessionStorage.setItem("goals", JSON.stringify(LoginData.goals))
        axios.put(`${url}/api/users`, {
            _id: this._id,
            goals: this.goals
        })
    }

    static updateGoal(goal: Goal, url: string) {
        this.goals = this.goals.map((g) => {
            if (g.id === goal.id) {
                return goal
            }
            return g
        })
        sessionStorage.setItem("goals", JSON.stringify(LoginData.goals))
        axios.put(`${url}/api/users`, {
            _id: this._id,
            goals: this.goals
        })
    }

    static getUserID() {
        return this._id
    }

    static getStorage() {
        if (this.loggedIn) return

        this.accessToken = sessionStorage.getItem("accessToken") || ''
        this.username = sessionStorage.getItem("username") || ''
        this.goals = JSON.parse(sessionStorage.getItem("goals") || '{}')
        this._id = sessionStorage.getItem("id") || ''

        if (this.accessToken && this.username && this.goals && this._id) {
            this.loggedIn = true
        }
    }
}