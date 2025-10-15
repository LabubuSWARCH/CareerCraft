import Image from "next/image";
import { GlowingEffect } from "./ui/glowing-effect";

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  image?: string;
}

export const GridItem = ({
  area,
  icon,
  title,
  description,
  image,
}: GridItemProps) => {
  return (
    <li className={`min-h-56 list-none ${area} block`}>
      <div className="relative flex flex-col rounded-2xl h-full border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          blur={0}
          borderWidth={3}
          spread={80}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex flex-col h-full justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            {image ? (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover object-top"
                />
              </div>
            ) : null}
            <div className="w-fit rounded-lg border border-gray-600 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-black md:text-2xl/[1.875rem] dark:text-white">
                {title}
              </h3>
              <h2 className="font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400 md:[&_b]:font-semibold md:[&_strong]:font-semibold">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
