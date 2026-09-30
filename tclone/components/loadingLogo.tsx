import Image from "next/image";

interface ILoadingLogo {
  size?: number;
  fullScreen?: boolean;
}

export default function LoadingLogo({
  size = 48,
  fullScreen = false,
}: ILoadingLogo) {
  const logo = (
    <div style={{ width: size, height: size }} className="animate-pulse-logo">
      <Image
        src="/X.png"
        alt="Loading"
        width={size}
        height={size}
        className="h-full w-full object-contain"
        priority
      />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        {logo}
      </div>
    );
  }

  return logo;
}
