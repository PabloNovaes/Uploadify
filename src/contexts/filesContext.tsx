// FileContext.js
import { storage } from "@/services/firebase/firebase.config";
import { getDownloadURL, listAll, ref } from "firebase/storage";

import { ReactNode, createContext, useEffect, useState } from 'react';


interface ChildrenProps {
    children: ReactNode;
}

interface FileProps {
    name: string;
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
                const filesData: FileProps[] = [];

                for (const file of res.items) {
                    const fileRef = ref(storage, `files/${file.name}`);
                    
                    const url = await getDownloadURL(fileRef)
                    filesData.push({ name: file.name, url: url });
                }

                setFiles(filesData);
            } catch (error) {
                return error
            }
        };

        fetchFiles();
    }, []);


    const onUploadFile = (file: FileProps) => {
        setFiles([file, ...files]);
    };


    return (
        <FileContext.Provider value={{ files, onUploadFile }}>
            {children}
        </FileContext.Provider>
    );
};

export { FileContext, FileProvider };

