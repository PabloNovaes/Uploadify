import {
    Dialog,
    DialogContent,
    DialogTrigger
} from "@/components/ui/dialog"
import { ReactNode } from "react"

// const type = {

// }

export function MediaModal({ fileURL, children }: { fileURL?: string, children: ReactNode }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-black flex items-center">
                <img className="max-h-[80vh] m-auto object-cover" src={fileURL} alt="" />
            </DialogContent>
        </Dialog>
    )
}