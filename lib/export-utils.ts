'use client'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

export interface ExportData {
  title: string
  data: any[]
  columns: string[]
  summary?: {
    label: string
    value: string | number
  }[]
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount)
}

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const exportToPDF = ({ title, data, columns, summary }: ExportData) => {
  const doc = new jsPDF()
  
  // Add title
  doc.setFontSize(20)
  doc.text(title, 20, 20)
  
  // Add generation date
  doc.setFontSize(10)
  doc.text(`Generated on: ${formatDate(new Date())}`, 20, 30)
  
  let yPosition = 50
  
  // Add summary if provided
  if (summary && summary.length > 0) {
    doc.setFontSize(14)
    doc.text('Summary', 20, yPosition)
    yPosition += 10
    
    summary.forEach((item) => {
      doc.setFontSize(10)
      const value = typeof item.value === 'number' ? formatCurrency(item.value) : item.value
      doc.text(`${item.label}: ${value}`, 25, yPosition)
      yPosition += 6
    })
    yPosition += 10
  }
  
  // Add table
  autoTable(doc, {
    head: [columns],
    body: data.map((row) => columns.map((col) => {
      const value = row[col]
      if (typeof value === 'number' && col.toLowerCase().includes('amount')) {
        return formatCurrency(value)
      }
      if (col.toLowerCase().includes('date') && value) {
        return formatDate(value)
      }
      return value?.toString() || ''
    })),
    startY: yPosition,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  })
  
  // Save the PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().getTime()}.pdf`)
}

export const exportToCSV = ({ title, data, columns }: ExportData) => {
  const csvContent = [
    columns.join(','),
    ...data.map((row) => 
      columns.map((col) => {
        const value = row[col]
        if (typeof value === 'number' && col.toLowerCase().includes('amount')) {
          return formatCurrency(value)
        }
        if (col.toLowerCase().includes('date') && value) {
          return formatDate(value)
        }
        const stringValue = value?.toString() || ''
        return `"${stringValue.replace(/"/g, '""')}"`
      }).join(',')
    )
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().getTime()}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export const exportToExcel = ({ title, data, columns, summary }: ExportData) => {
  const wb = XLSX.utils.book_new()
  
  // Prepare data for Excel
  const wsData = [
    [title],
    [`Generated on: ${formatDate(new Date())}`],
    [''],
  ]
  
  // Add summary if provided
  if (summary && summary.length > 0) {
    wsData.push(['Summary'])
    summary.forEach((item) => {
      const value = typeof item.value === 'number' ? item.value.toString() : item.value.toString()
      wsData.push([item.label, value])
    })
    wsData.push([''])
  }
  
  // Add headers
  wsData.push(columns)
  
  // Add data rows
  data.forEach((row) => {
    wsData.push(columns.map((col) => {
      const value = row[col]
      if (typeof value === 'number') {
        return value
      }
      if (col.toLowerCase().includes('date') && value) {
        return formatDate(value)
      }
      return value?.toString() || ''
    }))
  })
  
  const ws = XLSX.utils.aoa_to_sheet(wsData)
  
  // Set column widths
  const colWidths = columns.map(() => ({ wch: 15 }))
  ws['!cols'] = colWidths
  
  // Style the title row
  if (ws['A1']) {
    ws['A1'].s = {
      font: { bold: true, sz: 16 },
      alignment: { horizontal: 'center' }
    }
  }
  
  XLSX.utils.book_append_sheet(wb, ws, 'Report')
  XLSX.writeFile(wb, `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().getTime()}.xlsx`)
}

// Predefined export configurations for different report types
export const reportConfigs = {
  expenses: {
    title: 'Expense Report',
    columns: ['title', 'category', 'amount', 'date', 'status'],
  },
  investments: {
    title: 'Investment Report',
    columns: ['roundName', 'investorName', 'amount', 'type', 'date', 'equityPercentage'],
  },
  budgets: {
    title: 'Budget Report',
    columns: ['name', 'category', 'totalAmount', 'spent', 'remaining', 'utilization', 'endDate'],
  },
  tax: {
    title: 'Tax Deduction Report',
    columns: ['category', 'totalExpenses', 'deductibleAmount', 'taxSavings', 'deductibilityRate'],
  },
}