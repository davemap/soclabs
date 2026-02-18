import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Loader2, ZoomIn } from "lucide-react";

interface ProjectImageCropDialogProps {
  open: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (blob: Blob) => void;
  saving?: boolean;
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.crossOrigin = "anonymous";
    image.src = url;
  });
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  // Output at the crop area size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Transparent background (PNG)
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(
    image,
    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, pixelCrop.width, pixelCrop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas is empty"));
    }, "image/png", 1);
  });
}

const ProjectImageCropDialog = ({ open, imageSrc, onClose, onCropComplete, saving }: ProjectImageCropDialogProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState([0.5]);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropDone = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
    onCropComplete(blob);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Crop Project Image</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-80 bg-[repeating-conic-gradient(hsl(var(--muted))_0%_25%,transparent_0%_50%)] bg-[length:16px_16px] rounded-lg overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom[0]}
            aspect={16 / 9}
            objectFit="contain"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={(z) => setZoom([z])}
            onCropComplete={onCropDone}
          />
        </div>
        <div className="flex items-center gap-3 px-1">
          <ZoomIn className="h-4 w-4 text-muted-foreground shrink-0" />
          <Slider
            value={zoom}
            onValueChange={setZoom}
            min={0.2}
            max={3}
            step={0.05}
            className="flex-1"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : null}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectImageCropDialog;
