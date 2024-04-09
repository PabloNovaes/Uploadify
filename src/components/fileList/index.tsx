import { FileContext } from "@/contexts/filesContext";
import { File, Image, Video } from "@phosphor-icons/react";
import { useContext } from "react";
import { MediaModal } from "../mediaModal";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DotsThree, MagnifyingGlass } from "@phosphor-icons/react";

export function FileList() {
    const context = useContext(FileContext)

    return (
        <>
            <label className="flex gap-2 items-center w-fit rounded-full px-2 py-1 border bg-zinc-900">
                <MagnifyingGlass className="text-gray-400" />
                <input type="text" placeholder="Search files" className="w-[150px] font-light text-sm border-none bg-transparent focus:outline-none" />
            </label>
            <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-full">File</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {context?.files.map(({ name, url }) => {
                        return (
                            <TableRow key={name}>
                                <TableCell className="flex items-center m-auto gap-3 ">
                                    {name.endsWith('.jpg') && <Image className="text-teal-400 min-w-5 min-h-5" />}
                                    {name.endsWith('.png') && <Image className="text-teal-400 min-w-5 min-h-5" />}
                                    {name.endsWith('.mp4') && <Video className="text-teal-400 min-w-5 min-h-5" />}
                                    {name.endsWith('.*') && <File className="text-teal-400 min-w-5 min-h-5" />}
                                    <MediaModal fileURL={url}>
                                        <p className="ellipsised-text text-sm">{name}</p>
                                    </MediaModal>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <DotsThree size={22} />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>Profile</DropdownMenuItem>
                                            <DropdownMenuItem>Billing</DropdownMenuItem>
                                            <DropdownMenuItem>Team</DropdownMenuItem>
                                            <DropdownMenuItem>Subscription</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                </TableCell>
                            </TableRow>

                        )
                    })}
                </TableBody>
            </Table>
        </>

    );
}
