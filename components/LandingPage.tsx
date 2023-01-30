import Link from "next/link";
import Image from "next/image";
import {useEffect, useState} from "react";

export default function LandingPage() {
    const images = [
        "/mtnrun.jpg",
        "/runimg.jpg",
        "/runner-background.jpg",
        "/track.jpg",
    ];
    const style = [
        "opacity-10 scale-150",
        "opacity-25",
        "opacity-10",
        "opacity-20",
    ]
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            if (index === 3) {
                setIndex(0)
            } else {
                setIndex(index + 1)
            }
        }, 5000)
        return () => clearInterval(interval)
    }, [index])

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4 text-white bg-gray-800">
            <Image
                src={images[index]}
                alt="background image"
                className={`absolute top-0 left-0 w-full h-full object-cover ${style[index]}`}
                width={1920}
                height={1080}
            />


            <div className="z-10 flex flex-col items-center justify-center h-screen gap-4 text-white">
                <h1 className="flex items-end font-medium text-left text-8xl">
                    Strava Data Display
                </h1>
                <p className="flex items-center mb-20 text-lg text-left">
                    Our website allows you to easily view and analyze your Strava data,
                    including your activity history, progress, and performance metrics.
                </p>
                <div className="grid grid-cols-2 gap-8">
                    <Link
                        href="/create-account"
                        className="px-16 py-2 mt-4 text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                    >
                        Register
                    </Link>
                    <Link
                        href="/login"
                        className="px-4 py-2 mt-4 text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
