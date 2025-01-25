import { Marquee } from "@devnomic/marquee";

interface SlidingTickersProps {
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}

export function SlidingTickers({ className, innerClassName, children }: SlidingTickersProps) {
  return (
    <div className="py-4">
      <Marquee
        fade={true}
        direction="left"
        reverse={false}
        pauseOnHover={true}
        className={className}
        innerClassName={innerClassName}
        numberOfCopies={2}
      >
        {children}
      </Marquee>
    </div>
  );
}