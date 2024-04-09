import { FileList } from "@/components/FileList";
import { UploadZone } from "@/components/UploadZone";
import { Line } from "@/components/ui/line";
import { Queue } from "@phosphor-icons/react";
import { NavLink } from "react-router-dom";
import { Toaster } from "sonner";
import logo from "../assets/logo.svg";


export function Home() {

    return (
        <>
            <header className="flex justify-center items-center border-b flex-col">
                <div className="max-w-6xl w-full flex items-center p-4">
                    <span className="flex items-center">
                        <img src={logo} className="size-9" alt="logo" />
                    </span>
                    <Line space={2} />
                    <nav className=" max-w-6xl w-full flex gap-2">
                        <NavLink to={"/"} className="flex gap-2 text-sm items-center w-fit rounded-full px-3 py-1">
                            <Queue />
                            Uploads
                        </NavLink>
                    </nav>
                </div>

            </header>
            <main className="p-4 flex flex-col justify-center max-w-6xl w-full m-auto h-max gap-3">
                <UploadZone />
                <h1 className="text-3xl">Uploads</h1>
                <FileList />
            </main>
            <Toaster />

        </>

    )
}
