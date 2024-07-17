import { File, Upload, X } from "@phosphor-icons/react";
import { UploadTask, getDownloadURL, getMetadata, ref, uploadBytesResumable } from "firebase/storage";
import { useDropzone } from 'react-dropzone';
import { toast } from "sonner";
import { storage } from "../services/firebase/firebase.config";
import { Input } from "./ui/input";


import { FileContext } from "@/contexts/filesContext";
import { useContext, useEffect, useState } from "react";
import { sizeFormatter } from "./FileList";
import { Progress } from "./ui/progress";


export function UploadZone() {
    const [percent, setpercent] = useState(0)
    const [task, setTask] = useState<UploadTask | undefined>()
    const [currentFile, setCurrentFile] = useState<File | undefined>()
    const [toastId, setToastId] = useState<String | undefined>()

    const context = useContext(FileContext)

    const reset = () => {
        setpercent(0)
        setTask(undefined)
        setCurrentFile(undefined)
    }

    useEffect(() => {
        if (!task) return

        const emitToastTask = () => {
            if (task !== undefined && !toastId) return setToastId(currentFile?.name)
            toast((
                <div className="grid gap-2 w-full items-center relative">
                    <div className="grid items-center" style={{ gridTemplateColumns: 'min-content 1fr 50px' }}>
                        <File className="text-primary mr-3" size={20} />
                        <div className="text-sm text-primary grid" >
                            <p className="text-ellipsis overflow-hidden whitespace-nowrap">{currentFile?.name}</p>
                            <span className="opacity-75 text-xs">{sizeFormatter(Number(currentFile?.size))}</span>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                            <button className="w-fit rounded-full bg-secondary p-[3px] text-secondary-foreground" onClick={monitoringTask.cancel}>
                                <X size={14} />
                            </button>
                            <span className="text-white text-end text-xs">{percent !== 100 ? String(percent.toFixed(0)).concat("%") : "Concluido"}</span>
                        </div>
                    </div>
                    <Progress className="h-1.5" value={percent} />
                </div>
            ), {
                position: window.innerWidth <= 500 ? "bottom-center" : "bottom-right",
                id: String(toastId),
                className: 'bg-primary-foreground',
            })
        }

        emitToastTask()
    }, [task, percent])



    const monitoringTask = {
        upload(file: File) {

            if (file) {
                const { name, type } = file
                const path = ref(storage, `files/${name}`)
                const task = uploadBytesResumable(path, file, {
                    contentType: type
                })
                setTask(task)
                task.on('state_changed', (snapshot) => {
                    const value = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    setpercent(value)
                    if (snapshot.bytesTransferred == snapshot.totalBytes) {
                        toast.dismiss(currentFile?.name)
                        reset()
                        toast.success("Arquivo enviado com sucesso!", {
                            duration: 2000
                        })
                    }
                },
                    (error) => {
                        if (error.code === 'storage/canceled') {
                            return
                        } else {
                            toast.error("Ocorreu um erro inesperado!", {
                                duration: 2000
                            })
                            throw error
                        }


                    }, () => {
                        getDownloadURL(task.snapshot.ref).then(async (url) => {
                            const { name, size, contentType, customMetadata } = await getMetadata((ref(storage, `files/${file.name}`)))
                            context?.onUploadFile({ name, size, contentType, customMetadata, url })
                        })
                    })

            }
        },
        cancel() {
            task?.cancel()
            toast.dismiss()
            reset()
        }

    }

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({
        onDropAccepted: (files) => {
            setCurrentFile(files[0])
            monitoringTask.upload(files[0])
        }
    });

    return (
        <>
            <div className="flex flex-col gap-4">
                <div
                    {...getRootProps()}
                    className={`border-dashed border-2 min-h-[88px] ${isDragAccept ? 'border-teal-400 bg-primary-foreground brightness-105' : 'border'} min-h-[60px] rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-all duration-150 w-full p-4`}
                >
                    <Input id="fileUpload"
                        {...getInputProps()}
                        className="hidden"
                    />
                    {isDragAccept && (
                        <span className="flex flex-col items-center gap-3 ites-center">
                            <Upload className="w-5 h-5" />
                            <p className="text-sm ">Drop file here...</p>
                        </span>
                    )}
                    {isDragReject && (<p>Some files will be rejected</p>)}
                    {!isDragActive && (
                        <span className="flex flex-col items-center gap-3 ites-center">

                            {!task &&
                                <>
                                    <Upload className="w-5 h-5" />
                                    <p className="text-sm ">Drop file here...</p>
                                </>
                            }

                            {task &&
                                <>
                                    <Progress value={percent} />
                                    <p className="text-sm ">Sending file...</p>
                                </>
                            }
                        </span>
                    )}
                </div>

                {/* {task && (
                   
                )} */}
            </div>
        </>
    )
}
