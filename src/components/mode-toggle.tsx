import { useTheme } from "@/components/theme-provider"
import { Laptop, Moon, Sun } from "lucide-react"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <div className="flex items-center justify-center gap-1 p-1 border rounded-xl border-border text-muted-foreground">
            <button
                type="button"
                className={`p-1 rounded-lg ${theme === 'light' ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-accent hover:text-accent-foreground'}`}
                onClick={() => setTheme("light")}
            >
                <Sun className="w-4 h-4" />
            </button>
            <button
                type="button"
                className={`p-1 rounded-lg ${theme === 'dark' ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-accent hover:text-accent-foreground'}`}
                onClick={() => setTheme("dark")}
            >
                <Moon className="w-4 h-4" />
            </button>
            <button
                type="button"
                className={`p-1 rounded-lg ${theme === 'system' ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-accent hover:text-accent-foreground'}`}
                onClick={() => setTheme("system")}
            >
                <Laptop className="w-4 h-4" />
            </button>
        </div>
    )
}
