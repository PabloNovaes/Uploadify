import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { FileContext } from "@/contexts/filesContext";
import { storage } from "@/services/firebase/firebase.config";
import { CircleNotch, DotsThree, DownloadSimple, File, MagnifyingGlass, Trash } from "@phosphor-icons/react";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ref } from "firebase/storage";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { MediaModal } from "./MediaModal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";


interface DownloadingState {
    [key: string]: boolean;
}

interface Deleting {
    [key: string]: boolean;
}

export const sizeFormatter = (bytes: number) => {
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
};

export function FileList() {
    const context = useContext(FileContext);
    const [downloading, setDownloading] = useState<DownloadingState>({});
    const [deleting, setDeleting] = useState<Deleting>({});
    const [rowMenuOpen, setRowMenuOpen] = useState('');
    const [search, setSearch] = useState('')

    const generateDownloadUrl = async (url: string, name: string) => {
        try {
            setDownloading(prevDownloading => ({
                ...prevDownloading,
                [name]: true,
            }));
            const res = await fetch(url);
            const blob = await res.blob();

            return URL.createObjectURL(blob);
        } catch (error) {
            console.log(error);
        } finally {
            setDownloading(prevDownloading => ({
                ...prevDownloading,
                [name]: false,
            }));
        }
    };

    const fileActions = {
        async download({ url, name }:
            { url: string, name: string }) {
            const link = await generateDownloadUrl(url, name);
            const tempLinkElement = document.createElement("a");

            tempLinkElement.download = name;
            tempLinkElement.href = link as string;

            tempLinkElement.click();

            if (!downloading[name]) return setRowMenuOpen('')
        },
        async delete(name: string) {
            setDeleting(prev => ({
                ...prev,
                [name]: true,
            }));

            toast.promise(async () => {
                await new Promise((resolve, value) => setTimeout(() => { return resolve(value) }, 2000))
                ref(storage, `files/${name}`)
                setDeleting(prev => ({
                    ...prev,
                    [name]: false,
                }));
            }, {
                loading: 'Excluindo arquivo...',
                success: () => {
                    return 'Arquivo excluido com sucesso';
                },
            })


            if (!deleting[name]) {
                setRowMenuOpen('')
                context?.onDeleteFile(name)
            }
        }
    }

    const filteredFiles = context?.files.filter(file => file.name.toLowerCase().includes(search))

    return (
        <>

            <label className="flex gap-2 items-center w-fit rounded-full px-2 py-1 bg-primary-foreground/80 border">
                <MagnifyingGlass className="text-gray-400" />
                <input onChange={(e) => setSearch(e.target.value.toLowerCase())} type="text" placeholder="Search files" className="w-[150px] font-light text-sm border-none bg-transparent focus:outline-none" />
            </label>
            <div className="overflow-y-scroll">
                {filteredFiles?.length !== 0 ? <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className={`${context?.files.length === 0 && 'w-full'}`}>File</TableHead>
                            <TableHead className={`${context?.files.length !== 0 && 'w-[80px]'}`}>Size</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredFiles?.map(({ name, url, size, contentType }) => {
                            return (
                                <TableRow key={name}>
                                    <TableCell className="flex items-center m-auto gap-3 ">
                                        {contentType?.includes('image/') &&
                                            <div className="overflow-hidden aspect-square flex items-center bg-muted/40 rounded-md">
                                                <img src={url} className="text-teal-400 size-8 object-cover" />
                                            </div>
                                        }
                                        {contentType?.includes('video/') &&
                                            <div className="overflow-hidden aspect-square flex items-center bg-muted/40 rounded-md">
                                                <video src={url} className="text-teal-400 size-8 object-cover" />
                                            </div>
                                        }
                                        {contentType?.includes('application/') && <File className="text-teal-400 size-8" />}
                                        <MediaModal fileURL={url} type={contentType}>
                                            <p className="text-sm max-w-[90%] whitespace-nowrap overflow-hidden text-ellipsis">{name}</p>
                                        </MediaModal>
                                    </TableCell>
                                    <TableCell className="align-middle">
                                        <p className="text-[12px]">{sizeFormatter(size)}</p>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <DropdownMenu modal onOpenChange={() => {
                                            setRowMenuOpen(name)
                                            window.onclick = () => {
                                                if (rowMenuOpen !== "") return setRowMenuOpen('')
                                            }
                                        }} open={rowMenuOpen === name ? true : false}>
                                            <DropdownMenuTrigger>
                                                <DotsThree weight="bold" size={20} />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="grid gap-1">
                                                <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground" onClick={() => fileActions.download({ name, url })}>
                                                    {!downloading[name] ? (
                                                        <p className="flex gap-2 items-center">
                                                            <DownloadSimple size={18} weight="bold" />
                                                            Baixar
                                                        </p>

                                                    ) : (
                                                        <p className="flex gap-2 items-center">
                                                            <CircleNotch className="animate-spin" weight="bold" />
                                                            Baixando...
                                                        </p>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-500 hover:bg-red-600/10 " onClick={() => fileActions.delete(name)}>
                                                    <p className="flex gap-2 items-center">
                                                        <Trash weight="bold" />
                                                        Excluir
                                                    </p>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                        }
                    </TableBody>
                </Table>
                    : <div className="text-center mt-5 pt-5 border-t">Nenhum resultado</div>}
            </div>

        </>
    );
}
