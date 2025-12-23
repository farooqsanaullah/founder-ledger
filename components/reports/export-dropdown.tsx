'use client'

import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Download, FileText, Sheet, File } from 'lucide-react'
import { exportToPDF, exportToCSV, exportToExcel, ExportData } from '@/lib/export-utils'

interface ExportDropdownProps {
  data: ExportData
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

export function ExportDropdown({ data, variant = 'outline', size = 'sm' }: ExportDropdownProps) {
  const handleExport = (type: 'pdf' | 'csv' | 'excel') => {
    try {
      switch (type) {
        case 'pdf':
          exportToPDF(data)
          break
        case 'csv':
          exportToCSV(data)
          break
        case 'excel':
          exportToExcel(data)
          break
      }
    } catch (error) {
      console.error('Export failed:', error)
      // In a real app, you might want to show a toast notification
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <FileText className="w-4 h-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          <Sheet className="w-4 h-4 mr-2" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <File className="w-4 h-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}