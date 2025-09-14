import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Warnes } from "next/font/google"

export function SearchClients({ elements }: { elements: string[] }) {
  return <Command>
    <CommandInput placeholder="Type a command or search..." />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Suggestions">
        {elements.map((element, index) => <CommandItem key={index}>{element}</CommandItem>)}
      </CommandGroup>
    </CommandList>
  </Command>
}
