import { FileList } from '@/components/FileList'; // Importe o componente FileList e FileListLoading
import { FileListLoading } from '@/components/FileListLoading';
import { UploadZone } from '@/components/UploadZone';
import { Queue } from '@phosphor-icons/react';
import { Suspense } from 'react';
import { NavLink } from 'react-router-dom';
import { Toaster } from 'sonner';
import logo from "../assets/logo.svg";

export function Home() {
    return (
        <>
            <header className="flex justify-center items-center border-b flex-col">
                <div className="max-w-6xl w-full flex items-center p-4">

                    <span className="flex items-center">
                        <img src={logo} className="size-9" alt="logo" />
                    </span>
                    {/* <Line space={2} /> */}
                    <nav className=" max-w-6xl w-full flex gap-2">
                        <NavLink to={'/'} className="flex gap-2 text-sm items-center w-fit rounded-full px-3 py-2">
                            <Queue />
                            Uploads
                        </NavLink>
                    </nav>
                </div>
            </header>
            <main className="p-4 flex flex-col justify-center max-w-6xl w-full m-auto h-max gap-3">
                <UploadZone />
                <h1 className="text-3xl">Uploads</h1>
                <Suspense fallback={<FileListLoading />}>
                    <FileList />
                </Suspense>
            </main>
            <Toaster toastOptions={{
                classNames:{
                    success: "bg-green-500/30 backdrop-blur-lg border-[1px] border-green-500/30 text-green-400",
                    error: "bg-red-600/30 backdrop-blur-lg border-[1px] border-red-600/30 text-red-500"
                }
            }}/>
        </>
    );
}
