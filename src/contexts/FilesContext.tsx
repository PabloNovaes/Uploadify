// FileContext.js
import { storage } from "@/services/firebase/firebase.config";
import { getDownloadURL, getMetadata, listAll, ref } from "firebase/storage";

import { ReactNode, createContext, useEffect, useState } from 'react';


interface ChildrenProps {
    children: ReactNode;
}

interface FileProps {
    name: string;
    size: number;
    contentType: string | undefined;
    customMetadata: { [key: string]: string; } | undefined;
    url: string;
}


interface FileContextType {
    files: FileProps[];
    onUploadFile: (file: FileProps) => void;
}
const FileContext = createContext<FileContextType | undefined>(undefined);

const FileProvider = ({ children }: ChildrenProps) => {
    const [files, setFiles] = useState<FileProps[]>([]);

    const listRef = ref(storage, 'files');


    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const res = await listAll(listRef);
                const localFiles = localStorage.getItem("files") as string;
    
                if (JSON.parse(localFiles)?.length === res.items.length) {
                    setFiles(JSON.parse(localFiles));
                    return;
                }
    
                const promises = res.items.map(async (file) => {
                    const urlPromise = getDownloadURL(ref(storage, `files/${file.name}`));
                    const metadataPromise = getMetadata(file);
                    const [url, metadata] = await Promise.all([urlPromise, metadataPromise]);
                    return { name: metadata.name, size: metadata.size, contentType: metadata.contentType, customMetadata: metadata.customMetadata, url };
                });
    
                console.time();
                const filesData = await Promise.all(promises);
                console.timeEnd();
    
                localStorage.setItem("files", JSON.stringify(filesData));
                setFiles(filesData);
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchFiles();
    }, []);
    
    const onUploadFile = (file: FileProps) => {
        const updatedFiles = [file, ...files];
        localStorage.setItem('files', JSON.stringify(updatedFiles));
        setFiles(updatedFiles);
    };
    
    return (
        <FileContext.Provider value={{ files, onUploadFile }}>
            {children}
        </FileContext.Provider>
    );
    
};

export { FileContext, FileProvider };

