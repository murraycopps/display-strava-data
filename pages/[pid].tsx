import Link from "next/link";

export default function page(){
    return(
        <div className="text-white text-xl text-center h-screen flex items-center justify-center">
            <h1>Page not found click <Link className="text-blue-500" href="/">here</Link> to go back to the home page.</h1>
        </div>
    )
}