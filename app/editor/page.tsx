"use client"

import { useState, useRef } from "react"
import { toPng } from "html-to-image"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Web-safe fonts as fallback
const FONTS = [
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Verdana", value: "Verdana, sans-serif" },
  { name: "Helvetica", value: "Helvetica, sans-serif" },
  { name: "Times New Roman", value: "Times New Roman, serif" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Courier New", value: "Courier New, monospace" },
  { name: "Trebuchet MS", value: "Trebuchet MS, sans-serif" },
  { name: "Impact", value: "Impact, sans-serif" },
]

// Predefined color swatches
const COLOR_SWATCHES = [
  "#FFFFFF", // White
  "#000000", // Black
  "#F8F9FA", // Light gray
  "#343A40", // Dark gray
  "#E9ECEF", // Very light gray
  "#CED4DA", // Medium gray
  "#F8F0E3", // Cream
  "#EAEAEA", // Silver
]

export default function EditorPage() {
  const [quoteText, setQuoteText] = useState("")
  const [authorText, setAuthorText] = useState("")
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF")
  const [fontFamily, setFontFamily] = useState("Arial, sans-serif")
  const [textColor, setTextColor] = useState("#000000")
  const previewRef = useRef<HTMLDivElement>(null)

  const handleExportImage = async () => {
    if (!previewRef.current) return

    try {
      const dataUrl = await toPng(previewRef.current, {
        quality: 0.95,
        pixelRatio: 2,
      })

      // Create a download link
      const link = document.createElement("a")
      link.download = "quote.png"
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error("Error exporting image:", error)
    }
  }

  // Determine if we should use white or black text based on background color
  const shouldUseWhiteText = () => {
    // Convert hex to RGB
    const hex = backgroundColor.replace("#", "")
    const r = Number.parseInt(hex.substring(0, 2), 16)
    const g = Number.parseInt(hex.substring(2, 4), 16)
    const b = Number.parseInt(hex.substring(4, 6), 16)

    // Calculate luminance - if dark background, use white text
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5
  }

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Quote Editor</h1>

          {/* Quote Text Input */}
          <div className="space-y-2">
            <Label htmlFor="quote-text">Quote Text</Label>
            <Textarea
              id="quote-text"
              placeholder="Enter your quote here..."
              className="min-h-[150px]"
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
            />
          </div>

          {/* Author Input */}
          <div className="space-y-2">
            <Label htmlFor="author-text">Author (Optional)</Label>
            <Input
              id="author-text"
              placeholder="Author name"
              value={authorText}
              onChange={(e) => setAuthorText(e.target.value)}
            />
          </div>

          {/* Font Selection */}
          <div className="space-y-2">
            <Label htmlFor="font-select">Font</Label>
            <Select value={fontFamily} onValueChange={setFontFamily}>
              <SelectTrigger>
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                {FONTS.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    <span style={{ fontFamily: font.value }}>{font.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Background Color Selection */}
          <div className="space-y-2">
            <Label htmlFor="bg-color">Background Color</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="bg-color"
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-12 h-10 p-1"
              />
              <Input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="flex-1"
                placeholder="#FFFFFF"
              />
            </div>

            {/* Color Swatches */}
            <div className="flex flex-wrap gap-2 mt-2">
              {COLOR_SWATCHES.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  style={{ backgroundColor: color }}
                  onClick={() => setBackgroundColor(color)}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>

          {/* Text Color Selection */}
          <div className="space-y-2">
            <Label htmlFor="text-color">Text Color</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="text-color"
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-12 h-10 p-1"
              />
              <Input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="flex-1"
                placeholder="#000000"
              />
            </div>

            {/* Auto Text Color */}
            <div className="flex items-center mt-2">
              <Button
                variant="outline"
                onClick={() => setTextColor(shouldUseWhiteText() ? "#FFFFFF" : "#000000")}
                className="text-sm"
              >
                Auto-select text color based on background
              </Button>
            </div>
          </div>

          {/* Export Button */}
          <Button onClick={handleExportImage} className="w-full">
            Export as PNG
          </Button>
        </div>

        {/* Preview Area */}
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <div
            ref={previewRef}
            className="w-full max-w-md p-8 rounded-lg shadow-lg"
            style={{
              backgroundColor,
              fontFamily,
              color: textColor,
              minHeight: "300px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            <div>
              {quoteText || "Your quote will appear here"}
              {authorText && <div style={{ fontStyle: "italic", marginTop: "1rem" }}>- {authorText}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
