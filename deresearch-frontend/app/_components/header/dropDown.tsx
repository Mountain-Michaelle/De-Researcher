"use client"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

import WalletConnector from "../walletConnector"
import {FolderDot, CircleHelp, AlignRight, ChartNoAxesGantt } from "lucide-react"
import { useState } from "react"
import Link from 'next/link';

export const Dropdown = () => {
    const [isHovered, setIsHovered] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    console.log(isOpen)
    const handleMouseEnter = () => {
        setIsHovered(true);
      };
    
      const handleMouseLeave = () => {
        setIsHovered(false);
      };

      const handleOpen = () => {
        setIsOpen(!isOpen)
      }

    return(
<DropdownMenu>

  <DropdownMenuTrigger className="border-hidden outline-none" 
  onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
    {
        isHovered ?
        (<ChartNoAxesGantt className="text-[40px]" />)
        :
        (<AlignRight onClick={handleOpen} />)
    }
  
 
  </DropdownMenuTrigger>  

  
  <DropdownMenuContent className="bg-custom-gradient text-white opacity-1 md:hidden mr-5 mt-2">
    <DropdownMenuLabel className="w-fit h-fit"><WalletConnector /></DropdownMenuLabel>
    <DropdownMenuSeparator />
    <Link className="bg-inherit " href="/projects" ><DropdownMenuItem><FolderDot /> Projects</DropdownMenuItem></Link>
    <DropdownMenuItem><CircleHelp /> How it works </DropdownMenuItem>
    <DropdownMenuItem>Team</DropdownMenuItem>
    <DropdownMenuItem>Subscription</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
    )

}
