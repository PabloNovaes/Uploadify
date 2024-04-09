interface LineProps {
    space: number
}

export function Line({ space }: LineProps) {
    return (
        <span className={`px-${space}`}>
            <svg
                width="6"
                height="16"
                viewBox="0 0 6 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <line
                    x1="1.18372"
                    y1="15.598"
                    x2="5.32483"
                    y2="0.143194"
                    className="stroke-zinc-700"
                />
            </svg>
        </span>
    )
}