import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/images/logo.png"         // place logo.png in /public
        alt="Wolfer logo"
        width={24}
        height={24}
        className="h-10 w-10 rounded-none"
        priority
      />
      <span className="font-semibold text-lg tracking-tight">
        Wolfer<span className="text-brand-400">AI</span>
      </span>
    </div>
  );
}
