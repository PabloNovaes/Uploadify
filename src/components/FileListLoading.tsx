import { Skeleton } from "./ui/skeleton";
import { TableCell, TableRow } from "./ui/table";

export function FileListLoading() {
    return (
        <>
            {Array.from({ length: 4 }).map(() => (
                <TableRow key={crypto.randomUUID()}>
                    <TableCell>
                        <Skeleton className="h-5 w-full rounded" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-full rounded" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-full rounded" />
                    </TableCell>
                </TableRow>
            ))}
        </>
    )
}