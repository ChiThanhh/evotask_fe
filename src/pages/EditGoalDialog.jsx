import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import { updateGoal } from "@/services/GoalService";
import { toast } from "sonner";

export default function EditGoalDialog({ goal, onSave }) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState(goal.title);
    const [description, setDescription] = useState(goal.description || "");

    const handleSave = async () => {
        try {
            await updateGoal(goal.id, { title, description });
            setOpen(false);
            onSave({ ...goal, title, description });
            toast.success("Cập nhật mục tiêu thành công!");
        } catch (error) {
            toast.error("Cập nhật mục tiêu thất bại!");
            console.error("Error updating goal:", error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 ml-6">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Sửa mục tiêu</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Tiêu đề</label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Mô tả</label>
                        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave}>Lưu</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
