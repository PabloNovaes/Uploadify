import { Upload } from "@phosphor-icons/react";
import { UploadTask, getDownloadURL, getMetadata, ref, uploadBytesResumable } from "firebase/storage";
import { useDropzone } from 'react-dropzone';
import { toast } from "sonner";
import { storage } from "../services/firebase/firebase.config";
import { Input } from "./ui/input";


import { FileContext } from "@/contexts/FilesContext";
import { useContext, useState } from "react";
import { Progress } from "./ui/progress";


export function UploadZone() {
    const [percent, setpercent] = useState(0)
    const [task, setTask] = useState<UploadTask>()
    const context = useContext(FileContext)

    const reset = () => {
        setpercent(0)
        setTask(undefined)
    }

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
                        reset()
                        toast("Arquivo enviado com sucesso!", {
                            description: new Date().toLocaleString(),
                            action: {
                                label: "Fechar",
                                onClick: () => { return },
                            },
                        })
                    }
                },
                    (error) => {
                        console.log(error);

                    }, () => {
                        getDownloadURL(task.snapshot.ref).then(async (url) => {
                            const { name, size, contentType, customMetadata } = await getMetadata((ref(storage, `files/${file.name}`)))
                            context?.onUploadFile({ name, size, contentType, customMetadata, url })
                        })
                    })

            }
        },

    }

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({
        onDropAccepted: (files) => {
            monitoringTask.upload(files[0] as File)
        }
    });

    return (
        <>
            <div className="flex flex-col gap-4">
                <div
                    {...getRootProps()}
                    className={`border-dashed border-2 ${isDragAccept ? 'border-teal-400 bg-primary-foreground brightness-105' : 'border'} min-h-[60px] rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-all duration-150 w-full p-4`}
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
            </div>
        </>
    )
}
