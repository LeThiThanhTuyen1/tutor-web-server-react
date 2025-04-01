"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}

export default function LazyImage({ src, alt, className = "", width, height }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [imageSrc, setImageSrc] = useState("")

  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      setImageSrc(src)
      setIsLoaded(true)
    }
  }, [src])

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {!isLoaded && <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />}
      {imageSrc && (
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          src={imageSrc}
          alt={alt}
          className={`w-full h-full object-cover ${className}`}
          width={width}
          height={height}
        />
      )}
    </div>
  )
}

