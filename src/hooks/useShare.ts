import { useState, useCallback } from "react";
import { toast } from "sonner";

interface ShareOptions {
  title: string;
  text: string;
  url: string;
}

export const useShare = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareData, setShareData] = useState<ShareOptions | null>(null);

  const share = useCallback(async (options: ShareOptions) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: options.title,
          text: options.text,
          url: options.url,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error sharing:", error);
          // Fallback to modal if native share fails for other reasons
          setShareData(options);
          setIsModalOpen(true);
        }
      }
    } else {
      // Fallback to custom modal
      setShareData(options);
      setIsModalOpen(true);
    }
  }, []);

  return {
    share,
    isModalOpen,
    setIsModalOpen,
    shareData,
  };
};
