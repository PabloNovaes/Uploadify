import {
    Dialog,
    DialogContent,
    DialogTrigger
} from "@/components/ui/dialog"
import { ReactNode } from "react"


export function MediaModal({ fileURL, children, type }:
    {
        fileURL?: string,
        children: ReactNode,
        type: string | undefined
    }) {
    return (
        <Dialog>
            <DialogTrigger asChild className="max-[500px]:max-w-[40vw]">
                {children}
            </DialogTrigger>
            <DialogContent className="max-[500px]:max-w-[90vw] max-vw-[50vw] bg-black flex items-center">
                <div className="min-h-[80dvh] flex items-center justify-center w-full">
                    {type?.includes('image/') && <img src={fileURL} className="w-full" />}
                    {type?.includes('video/') && <video src={fileURL} controls className="h-[90vh]"></video>}
                    {type?.includes('application/') && <object data={fileURL} ></object>}
                </div>
            </DialogContent>
        </Dialog>
    )
}