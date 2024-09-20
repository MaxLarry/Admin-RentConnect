import { EllipsisVertical } from "lucide-react";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  
function OptionEllipsis() {

  return (
    <Button  variant="ghost" className="p-2"
  ><EllipsisVertical className="w-4"/>
  </Button>
  );
}

export default OptionEllipsis;
