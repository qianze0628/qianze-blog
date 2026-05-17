import { useState } from 'react'
import { motion } from 'framer-motion'

export default function FlipCard({ front, back, height = 'h-56' }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className={`perspective-1000 w-full ${height} cursor-pointer`}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped(v => !v)}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="absolute inset-0 backface-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-black rounded">
          {front}
        </div>
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-black text-white dark:bg-white dark:text-black rounded">
          {back}
        </div>
      </motion.div>
    </div>
  )
}
