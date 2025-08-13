import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createGoal } from "@/services/GoalService";
import { toast } from "sonner";

export default function GoalDialog({ onCreate }) {
    const [goalType, setGoalType] = useState("daily");
    const [goalTitle, setGoalTitle] = useState("");
    const [goalDescription, setGoalDescription] = useState("");
    const data = JSON.parse(localStorage.getItem("data"));
    const handleCreate = async () => {
        if (!goalTitle.trim()) return;
        try {
            const dataGoal = {
                user_id: data.user.id,
                title: goalTitle,
                description: goalDescription,
                type: goalType,
                start_date: new Date().toISOString().split("T")[0],
                exp_reward: 0,
            }
            await createGoal(dataGoal);

            toast.success("Tạo mục tiêu thành công!");
            setGoalTitle("");
            setGoalDescription("");
            if (onCreate) onCreate();
        } catch (error) {
            toast.error("Tạo mục tiêu thất bại!");
            console.error("Error creating goal:", error);
        }

    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="mt-4">Tạo mục tiêu</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tạo mục tiêu mới</DialogTitle>
                    <DialogDescription>
                        Chọn loại mục tiêu và nhập nội dung.
                    </DialogDescription>
                </DialogHeader>

                {/* Chọn loại mục tiêu */}
                <div className="space-y-2">
                    <Label>Loại mục tiêu</Label>
                    <Select value={goalType} onValueChange={setGoalType}>
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="daily">Hàng ngày</SelectItem>
                            <SelectItem value="weekly">Hàng tuần</SelectItem>
                            <SelectItem value="monthly">Hàng tháng</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Nhập nội dung */}
                <div className="space-y-2">
                    <Label>Nội dung mục tiêu</Label>
                    <Input
                        placeholder="Tiêu đề..."
                        value={goalTitle}
                        onChange={(e) => setGoalTitle(e.target.value)}
                    />
                    <Textarea
                        placeholder="Mô tả..."
                        value={goalDescription}
                        onChange={(e) => setGoalDescription(e.target.value)}
                    />
                </div>
                {/* Nút tạo */}
                <Button className="w-full mt-4" onClick={handleCreate}>
                    Xác nhận
                </Button>
            </DialogContent>
        </Dialog>
    );
}
