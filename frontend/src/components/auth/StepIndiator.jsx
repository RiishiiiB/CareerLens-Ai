const steps = [
  "Basic Info",
  "Academic",
  "Profile",
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="mb-10">

      <div className="flex items-center justify-between">

        {steps.map((step, index) => {
          const active = currentStep === index + 1;
          const completed = currentStep > index + 1;

          return (
            <div
              key={step}
              className="flex flex-1 items-center"
            >
              <div className="flex flex-col items-center">

                <div
                  className={`
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    text-sm
                    font-bold
                    transition-all
                    duration-300

                    ${
                      completed
                        ? "border-blue-600 bg-blue-600 text-white"
                        : active
                        ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                        : "border-slate-700 bg-[#151515] text-slate-400"
                    }
                  `}
                >
                  {index + 1}
                </div>

                <span
                  className={`
                    mt-3
                    text-sm
                    font-medium

                    ${
                      active
                        ? "text-white"
                        : "text-slate-500"
                    }
                  `}
                >
                  {step}
                </span>

              </div>

              {index !== steps.length - 1 && (
                <div
                  className={`
                    mx-4
                    h-[2px]
                    flex-1
                    rounded-full

                    ${
                      completed
                        ? "bg-blue-600"
                        : "bg-slate-700"
                    }
                  `}
                />
              )}
            </div>
          );
        })}

      </div>

    </div>
  );
}