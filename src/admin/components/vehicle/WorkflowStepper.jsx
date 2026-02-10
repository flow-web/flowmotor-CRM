/**
 * WorkflowStepper — Visual stepper for vehicle workflow
 * Props: steps (WORKFLOW_ORDER), currentStatus, labels (VEHICLE_STATUS_LABELS), onStatusChange
 */
import { Check } from 'lucide-react'

function WorkflowStepper({ steps, currentStatus, labels, onStatusChange }) {
  const currentIndex = steps.indexOf(currentStatus)

  return (
    <div className="flex items-center w-full">
      {steps.map((status, index) => {
        const isCompleted = index < currentIndex
        const isActive = index === currentIndex
        const isFuture = index > currentIndex
        const canActivate = index <= currentIndex + 1
        const isLast = index === steps.length - 1

        return (
          <div key={status} className="flex items-center flex-1 last:flex-none">
            {/* Step */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => canActivate && onStatusChange(status)}
                disabled={!canActivate}
                className={`
                  relative w-10 h-10 rounded-full flex items-center justify-center
                  transition-all duration-300 font-medium text-sm
                  ${isCompleted
                    ? 'bg-green-500 text-white cursor-pointer hover:bg-green-400'
                    : isActive
                    ? 'bg-accent text-white cursor-default'
                    : canActivate
                    ? 'bg-transparent border-2 border-white/20 text-white/40 cursor-pointer hover:border-white/40'
                    : 'bg-transparent border-2 border-white/10 text-white/20 cursor-not-allowed'
                  }
                `}
              >
                {isCompleted ? (
                  <Check size={18} />
                ) : (
                  <span>{index + 1}</span>
                )}

                {/* Active ping animation */}
                {isActive && (
                  <span className="absolute inset-0 rounded-full animate-ping bg-accent/30" />
                )}
              </button>

              {/* Label */}
              <span className={`
                mt-2 text-xs font-medium whitespace-nowrap
                ${isCompleted ? 'text-green-400' : isActive ? 'text-white' : 'text-white/30'}
              `}>
                {labels[status] || status}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div className="flex-1 mx-2 mt-[-20px]">
                <div className="h-[2px] w-full rounded-full transition-colors duration-500"
                  style={{
                    backgroundColor: index < currentIndex
                      ? '#22C55E'     // green for completed
                      : 'rgba(255,255,255,0.1)'  // muted for future
                  }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default WorkflowStepper
