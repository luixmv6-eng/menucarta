"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function ExplodingPlate() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Transform values for each element based on scroll
  const plateScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.9])
  const plateRotate = useTransform(scrollYProgress, [0, 0.5, 1], [-10, 0, 10])
  const plateOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  // Individual element transforms - they separate as user scrolls
  const element1Y = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, -60, -120])
  const element1X = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, -40, -80])
  const element1Rotate = useTransform(scrollYProgress, [0.2, 0.8], [0, -25])

  const element2Y = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, -80, -160])
  const element2X = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 30, 60])
  const element2Rotate = useTransform(scrollYProgress, [0.2, 0.8], [0, 20])

  const element3Y = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 50, 100])
  const element3X = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, -60, -120])
  const element3Rotate = useTransform(scrollYProgress, [0.2, 0.8], [0, -15])

  const element4Y = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 70, 140])
  const element4X = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 50, 100])
  const element4Rotate = useTransform(scrollYProgress, [0.2, 0.8], [0, 30])

  const element5Y = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, -40, -80])
  const element5Scale = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [1, 1.2, 1.4])

  const steamOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 0.6, 0])
  const steamY = useTransform(scrollYProgress, [0.3, 0.7], [0, -100])

  return (
    <div 
      ref={containerRef}
      className="relative h-[80vh] md:h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background glow */}
      <motion.div
        style={{ opacity: plateOpacity }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
      </motion.div>

      {/* Main plate container */}
      <motion.div
        style={{ 
          scale: plateScale, 
          rotate: plateRotate, 
          opacity: plateOpacity 
        }}
        className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px]"
      >
        {/* The plate base */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm"
          style={{
            boxShadow: "0 30px 60px rgba(0,0,0,0.4), inset 0 2px 10px rgba(255,255,255,0.1)"
          }}
        >
          {/* Inner plate circle */}
          <div className="absolute inset-8 md:inset-12 rounded-full border border-primary/20" />
          <div className="absolute inset-16 md:inset-20 rounded-full border border-primary/10" />
        </motion.div>

        {/* Steam effect */}
        <motion.div
          style={{ opacity: steamOpacity, y: steamY }}
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [-10, -30, -10],
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 w-8 h-20 bg-gradient-to-t from-transparent via-white/20 to-transparent rounded-full blur-md"
              style={{ left: `${30 + i * 20}%` }}
            />
          ))}
        </motion.div>

        {/* Food element 1 - Main protein (center) */}
        <motion.div
          style={{ y: element5Y, scale: element5Scale }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-36 md:h-36 lg:w-44 lg:h-44"
        >
          <div className="w-full h-full rounded-xl bg-gradient-to-br from-amber-800 via-amber-900 to-amber-950 shadow-2xl border border-amber-700/30 overflow-hidden">
            {/* Grill marks */}
            <div className="absolute inset-0 opacity-40">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute h-1 bg-amber-950/60 rounded-full"
                  style={{
                    top: `${20 + i * 15}%`,
                    left: "10%",
                    right: "10%",
                    transform: "rotate(-30deg)"
                  }}
                />
              ))}
            </div>
            {/* Highlight */}
            <div className="absolute top-2 left-2 w-1/3 h-1/4 bg-gradient-to-br from-amber-600/40 to-transparent rounded-lg" />
          </div>
        </motion.div>

        {/* Food element 2 - Garnish (top left) */}
        <motion.div
          style={{ y: element1Y, x: element1X, rotate: element1Rotate }}
          className="absolute top-[20%] left-[15%] w-12 h-12 md:w-16 md:h-16"
        >
          <div className="w-full h-full">
            {/* Herb leaves */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg" />
            <div className="absolute -top-2 -right-2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-md" />
            <div className="absolute -bottom-1 left-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-800 shadow-md" />
          </div>
        </motion.div>

        {/* Food element 3 - Sauce drops (top right) */}
        <motion.div
          style={{ y: element2Y, x: element2X, rotate: element2Rotate }}
          className="absolute top-[25%] right-[18%] w-16 h-10 md:w-20 md:h-14"
        >
          <div className="relative w-full h-full">
            <div className="absolute top-0 left-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-red-600 via-red-700 to-red-900 shadow-lg" />
            <div className="absolute bottom-0 right-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-800 shadow-md" />
            <div className="absolute top-1/2 left-1/2 w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-br from-red-600 to-red-900 shadow-sm" />
          </div>
        </motion.div>

        {/* Food element 4 - Vegetable (bottom left) */}
        <motion.div
          style={{ y: element3Y, x: element3X, rotate: element3Rotate }}
          className="absolute bottom-[22%] left-[20%] w-14 h-8 md:w-20 md:h-12"
        >
          <div className="w-full h-full rounded-lg bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 shadow-lg transform -rotate-12 border border-orange-400/30">
            <div className="absolute top-1 left-1 w-2 h-2 bg-orange-300/50 rounded-full" />
          </div>
        </motion.div>

        {/* Food element 5 - Garnish (bottom right) */}
        <motion.div
          style={{ y: element4Y, x: element4X, rotate: element4Rotate }}
          className="absolute bottom-[20%] right-[15%] w-10 h-14 md:w-14 md:h-20"
        >
          <div className="relative w-full h-full">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-10 md:w-4 md:h-14 bg-gradient-to-t from-green-900 to-green-700 rounded-full shadow-md" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 md:w-12 md:h-12">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-4 h-1.5 md:w-6 md:h-2 bg-gradient-to-r from-green-600 to-green-500 rounded-full shadow-sm origin-left"
                  style={{
                    transform: `rotate(${-60 + i * 30}deg) translateY(-50%)`
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Gold leaf accent */}
        <motion.div
          style={{ y: element1Y, rotate: element2Rotate }}
          className="absolute top-[35%] right-[30%] w-6 h-6 md:w-8 md:h-8"
        >
          <div className="w-full h-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 rounded-sm shadow-lg transform rotate-45 opacity-80" />
        </motion.div>

        {/* Micro greens scattered */}
        {[
          { top: "40%", left: "25%", size: "w-2 h-2" },
          { top: "55%", right: "28%", size: "w-1.5 h-1.5" },
          { top: "65%", left: "35%", size: "w-2 h-2" },
        ].map((pos, i) => (
          <motion.div
            key={i}
            style={{ 
              y: i % 2 === 0 ? element1Y : element3Y,
              x: i % 2 === 0 ? element2X : element4X
            }}
            className="absolute rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-sm"
            style={{ 
              top: pos.top, 
              left: pos.left, 
              right: pos.right 
            }}
          >
            <div className={`${pos.size} rounded-full bg-gradient-to-br from-green-400 to-green-600`} />
          </motion.div>
        ))}
      </motion.div>

      {/* Text overlay */}
      <motion.div
        style={{ opacity: plateOpacity }}
        className="absolute bottom-10 md:bottom-20 left-0 right-0 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-xs md:text-sm tracking-[0.3em] text-primary/60 uppercase"
        >
          Scroll to discover
        </motion.p>
      </motion.div>
    </div>
  )
}
