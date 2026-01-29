import { ArrowRight } from "lucide-react"

interface ServiceCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export default function ServiceCard({
  icon,
  title,
  description,
}: ServiceCardProps) {
  return (
    <div className="
      group relative rounded-2xl p-[1px]
      bg-gradient-to-br from-blue-500/40 via-purple-500/40 to-cyan-500/40
      hover:from-blue-500 hover:to-cyan-500
      transition-all duration-500
    ">
      <div className="
        h-full rounded-2xl p-6
        bg-white/90 dark:bg-[#0B1220]/90
        backdrop-blur-xl
        shadow-lg dark:shadow-blue-500/10
        hover:shadow-2xl
        transition-all
      ">
        {/* Icon */}
        <div className="
          mb-4 flex h-14 w-14 items-center justify-center
          rounded-xl
          bg-blue-600/10 dark:bg-blue-500/20
          text-blue-600 dark:text-blue-400
          group-hover:scale-110 transition
        ">
          {icon}
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>

        {/* CTA */}
        <button className="
          mt-5 inline-flex items-center gap-2
          text-sm font-medium
          text-blue-600 dark:text-blue-400
          group-hover:gap-3 transition-all
        ">
          Learn more <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
