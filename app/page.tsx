"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Copy, Check, Trash } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { onFormatMarkdown } from "./actions/onFormatMarkdown"

export default function MarkdownConverter() {
  const [markdown, setMarkdown] = useState("")
  const [convertedContent, setConvertedContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const handleConvert = async () => {
    setIsLoading(true)
    setError("")
    setCopied(false)
    try {
      const formattedMarkdown = onFormatMarkdown(markdown)
      setConvertedContent(formattedMarkdown)
    } catch (err) {
      console.error(err)
      setError("An error occurred while converting the Markdown. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(convertedContent)
    setCopied(true)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
     <h1 className="text-3xl font-bold text-center text-indigo-400 mb-8 flex items-center justify-center gap-4">
        <Image 
          src="/icon.svg"
          alt="Markdown Converter Icon"
          width={32}
          height={32}
        />

        Markdown Converter
      </h1>
    <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_1fr] gap-8 h-[calc(100vh-200px)]">
      <div className="h-full">
        <label htmlFor="markdown-input" className="block text-md font-medium text-gray-300 mb-2">
          Markdown Input 
        </label>
        <Textarea
          id="markdown-input"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="w-full h-[calc(100%-2rem)] resize-none p-4 bg-gray-800 text-gray-100 border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter your Markdown here..."
        />
      </div>

      <div className="flex flex-col items-center justify-center space-y-8">
        <Button
          onClick={handleConvert}
          disabled={isLoading || !markdown}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:none focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          {isLoading ? "Converting..." : "Convert"}
        </Button>
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-center">
            {error}
          </motion.div>
        )}
      </div>

      <div className="h-full">
      <div className="flex justify-between items-center mb-2">
          <h2 className="block text-md font-medium text-gray-300">Converted Output</h2>
          <div className="flex items-center gap-2">
            {convertedContent && (
              <>
                <button
                    onClick={() => setConvertedContent("")}
                    className="p-1 hover:bg-gray-800 rounded-md transition-colors"
                  >
                  <Trash className="h-4 w-4 text-red-400" />
                </button>

                <button
                  onClick={handleCopy}
                  className="p-1 hover:bg-gray-800 rounded-md transition-colors"
                  title={copied ? "Copied!" : "Copy to clipboard"}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-indigo-400" />
                  )}
                </button>
              </>
            )}
         </div>
        </div>
        <Textarea 
          value={convertedContent} 
          readOnly 
          className="w-full h-[calc(100%-2rem)] resize-none p-4 bg-gray-800 text-gray-100 border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  </div>
  )
}

