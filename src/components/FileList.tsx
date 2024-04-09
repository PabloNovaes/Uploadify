import { FileContext } from "@/contexts/filesContext";
import { File, Image, Video } from "@phosphor-icons/react";
import { Key, useContext } from "react";
import { MediaModal } from "./MediaModal";

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
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { DotsThree, MagnifyingGlass } from "@phosphor-icons/react";
import { Skeleton } from "./ui/skeleton";

export function FileList() {
    const context = useContext(FileContext)

    const sizeFormatter = (bytes: number) => {
        const kilobyte = 1024;
        const megabyte = kilobyte * 1024;
        const gigabyte = megabyte * 1024;

        if (bytes < kilobyte) {
            return bytes + ' B';
        } else if (bytes < megabyte) {
            return (bytes / kilobyte).toFixed(1) + ' KB';
        } else if (bytes < gigabyte) {
            return (bytes / megabyte).toFixed(1) + ' MB';
        } else {
            return (bytes / gigabyte).toFixed(1) + ' GB';
        }
    }

    return (
        <>
            <label className="flex gap-2 items-center w-fit rounded-full px-2 py-1 bg-zinc-900 border">
                <MagnifyingGlass className="text-gray-400" />
                <input type="text" placeholder="Search files" className="w-[150px] font-light text-sm border-none bg-transparent focus:outline-none" />
            </label>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className={`${context?.files.length === 0 && 'w-full'}`}>File</TableHead>
                        <TableHead className={`${context?.files.length !== 0 && 'w-[80px]'}`}>Size</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {context?.files.length === 0 && Array.from({ length: 4 }).map((indx)=>(
                        <TableRow key={indx as Key}>
                            <TableCell>
                                <Skeleton className="h-5 w-full rounded"/>
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-5 w-full rounded"/>
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-5 w-full rounded"/>
                            </TableCell>
                        </TableRow>
                    ))}
                    {context?.files.length !== 0 && context?.files.map(({ name, url, size, contentType }) => {
                        return (
                            <TableRow key={name}>
                                <TableCell className="flex items-center m-auto gap-3 ">
                                    {contentType?.includes('image/') && <Image className="text-teal-400 min-w-5 min-h-5" />}
                                    {contentType?.includes('video/') && <Video className="text-teal-400 min-w-5 min-h-5" />}
                                    {contentType?.includes('application/') && <File className="text-teal-400 min-w-5 min-h-5" />}
                                    <MediaModal fileURL={url} type={contentType}>
                                        <p className="ellipsised-text text-sm">{name}</p>
                                    </MediaModal>
                                </TableCell>
                                <TableCell>
                                    <p className="text-[12px]">{sizeFormatter(size)}</p>
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
