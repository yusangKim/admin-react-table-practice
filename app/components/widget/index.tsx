import { FC, PropsWithChildren } from 'react'

interface IWidgetProps {
  title?: string | null
  description?: string | null
  right?: string | null
}

const Widget: FC<PropsWithChildren<IWidgetProps>> = ({
  title = null,
  description = null,
  right = null,
  children,
}) => {
  return (
    <div className="w-full p-4 mb-4 bg-white border border-gray-100 rounded-lg widget dark:bg-gray-900 dark:border-gray-800">
      {(title || description || right) && (
        <div className="flex flex-row items-center justify-between mb-6">
          <div className="flex flex-col">
            <div className="text-sm font-light text-gray-500">{title}</div>
            <div className="text-sm font-bold">{description}</div>
          </div>
          {right}
        </div>
      )}
      {children}
    </div>
  )
}

export default Widget
