import { Loader2 } from "lucide-react";

interface LoaderProps {
  fullScreen?: boolean;
  className?: string;
  size?: number;
  videoSrc?: string;
  text?: string;
  variant?: 'default' | 'jumping' | 'linear' | 'grid' | 'custom';
}

export const Loader = ({ fullScreen = false, className = "", size = 48, videoSrc, text, variant = 'default' }: LoaderProps) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm animate-fade-in">
        {videoSrc ? (
          <div className="flex flex-col items-center">
            <video
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="w-64 h-64 object-contain mb-4 rounded-xl"
            />
            {text && (
              <p className="text-xl font-medium text-foreground animate-pulse">
                {text}
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl luxe-gradient flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-primary-foreground font-bold text-2xl">L</span>
              </div>
              <div className="absolute -inset-4 border-t-4 border-primary rounded-full w-24 h-24 animate-spin border-r-transparent border-b-transparent border-l-transparent"></div>
            </div>
            <p className="mt-8 text-lg font-medium text-foreground animate-pulse">
              Loading your dashboard...
            </p>
          </>
        )}
      </div>
    );
  }

  if (variant === 'jumping') {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="loader"></div>
      </div>
    );
  }

  if (variant === 'custom') {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="custom-loader"></div>
      </div>
    );
  }

  if (variant === 'linear') {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="linear-loader"></div>
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="grid-loader">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }

  if (videoSrc) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="w-48 h-48 object-contain mb-4 rounded-xl"
        />
        {text && (
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <Loader2 className="animate-spin text-primary" size={size} />
    </div>
  );
};
