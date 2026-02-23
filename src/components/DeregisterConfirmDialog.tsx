import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeregisterConfirmDialogProps {
  open: boolean;
  interestName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeregisterConfirmDialog = ({ open, interestName, onConfirm, onCancel }: DeregisterConfirmDialogProps) => (
  <AlertDialog open={open} onOpenChange={(o) => !o && onCancel()}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Remove interest?</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to deregister your interest in{" "}
          <span className="font-semibold text-foreground">{interestName || "this topic"}</span>?
          You can re-register at any time.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm}>Remove</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default DeregisterConfirmDialog;
