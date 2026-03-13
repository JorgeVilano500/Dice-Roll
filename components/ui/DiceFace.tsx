type DiceFaceProps = {
value: 1 | 2 | 3 | 4 | 5 | 6;
size?: number;
className?: string;

}

export function DiceFace({value, size = 80} : DiceFaceProps) {
    const pip = "w-3 h-3 rounded-full bg-black dark:bg-white"

    const positions: Record<DiceFaceProps["value"], string[]> = {
        1: ["center"],
        2: ["top-left", "bottom-right"],
        3: ["top-left", "bottom-right", "center"],
        4: ["top-left", "bottom-right", "top-right", "bottom-left"],
        5: ["top-left", "bottom-right", "top-right", "bottom-left", "center"],
        6: ["top-left", "bottom-right", "top-right", "bottom-left", "top-center", "bottom-center"],
    }

    const posClass = (pos: string) => {
        switch(pos) {
            case "top-left": return "top-2 left-2";
            case "bottom-right": return "bottom-2 right-2";
            case "center": return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
            case "top-right": return "top-2 right-2";
            case "bottom-left": return "bottom-2 left-2";
            case "top-center": return "top-2 left-1/2 -translate-x-1/2";
            case "bottom-center": return "bottom-2 left-1/2 -translate-x-1/2";
            default: return "";
        }
    }

    return (

        <div
            className="relative rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 shadow-md"
            style={{width: size, height: size}}

        > 
            {
                positions[value].map((pos) => (
                    <span key={pos} className={`absolute ${posClass(pos)} ${pip}`} />
                ))
            }
        </div>
    )
}