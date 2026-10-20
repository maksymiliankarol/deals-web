import Check from '../assets/check.svg?react'

type FormStepsProps = {
  total: number
  current: number
}

const FormSteps = ({ total, current }: FormStepsProps) => {
  return (
    <div
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current + 1}
      aria-label={`Step ${current + 1} of ${total}`}
      className="flex divide-x-2 divide-black border-2"
    >
      {Array.from({ length: total }, (_, i) => {
        const done = i < current
        const active = i === current

        return (
          <div
            key={i}
            className={`h-10 flex flex-1 items-center justify-center ${
              done ? 'bg-green text-white' : active ? 'bg-white font-bold' : 'bg-transparent opacity-30'
            }`}
          >
            <div className="flex items-center gap-1">
              {done && <Check />}
              <div className='flex items-center gap-1'>
                <span className='hidden sm:flex'>
                  Step
                </span> 
                {i + 1}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default FormSteps