import { CommandGroup, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import React from "react";

interface DegreeListProps {
  degrees: { id: number; degree_name: string }[];
  selectedDegreeId: number | null;
  onSelect: (id: number) => void;
}

const DegreeList: React.FC<DegreeListProps> = ({ degrees, selectedDegreeId, onSelect }) => {
  return (
    <div key={degrees.length}>
      <CommandGroup className="overflow-y-auto max-h-60">
        {degrees.map((degree) => (
          <CommandItem
            key={degree.id}
            onSelect={() => onSelect(degree.id)}
          >
            <Check
              className={cn(
                "mr-2 h-4 w-4",
                degree.id === selectedDegreeId ? "opacity-100" : "opacity-0"
              )}
            />
            {degree.degree_name}
          </CommandItem>
        ))}
      </CommandGroup>
    </div>
  );
};

export default DegreeList;