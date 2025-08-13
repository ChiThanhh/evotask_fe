import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";
import GoalDialog from "./GoalDialog";
import EditGoalDialog from "./EditGoalDialog";
import { getGoals, getMonthlyGoals, completeGoal, getMonthlyPies } from "@/services/GoalService";
import { getCharacter } from "@/services/CharacterService";
import { toast } from "sonner";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Legend, Cell } from "recharts";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

import lv1 from "@/assets/lv1.gif";
import lv2 from "@/assets/lv2.gif";
import lv3 from "@/assets/lv3.gif";
import lv4 from "@/assets/lv4.gif";
import lv5 from "@/assets/lv5.gif";
import lv6 from "@/assets/lv6.gif";
import lv7 from "@/assets/lv7.gif";
import lv8 from "@/assets/lv8.gif";
import lv9 from "@/assets/lv9.gif";
import lv10 from "@/assets/lv10.gif";
import lv11 from "@/assets/lv11.gif";
import lv12 from "@/assets/lv12.gif";
import lv13 from "@/assets/lv13.gif";

export default function Dashboard() {
    const navigate = useNavigate();
    const dataId = JSON.parse(localStorage.getItem("data"));
    const userId = dataId.user.id;
    const { width, height } = useWindowSize();
    const info = dataId.user
    const [goalType, setGoalType] = useState("daily");
    const [goalsData, setGoalsData] = useState({ daily: [], weekly: [], monthly: [] });
    const [character, setCharacter] = useState({ level: 1, exp: 0, next_level_exp: 100 });
    const [expPercent, setExpPercent] = useState(0);
    const [expData, setExpData] = useState([]);
    const [isLevelUp, setIsLevelUp] = useState(false);
    const [pieData, setPieData] = useState([]);
    const viMap = {
        daily: "Hàng ngày",
        weekly: "Hàng tuần",
        monthly: "Hàng tháng",
    };
    useEffect(() => {
        const fetchExpData = async () => {
            try {
                const res = await getMonthlyGoals({ user_id: userId });
                setExpData(res);
            } catch (err) {
                console.error("Error fetching monthly EXP:", err);
            }
        };
        fetchExpData();
    }, [userId]);
useEffect(() => {
    const fetchPieData = async () => {
        try {
            const res = await getMonthlyPies({ user_id: userId });
            const translated = res.map(item => ({
                ...item,
                name: viMap[item.name] || item.name
            }));
            setPieData(translated);
        } catch (err) {
            console.error("Error fetching pie chart data:", err);
        }
    };
    fetchPieData();
}, [userId]);
    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const data = await getGoals({ status: "pending", user_id: userId });
                const grouped = { daily: [], weekly: [], monthly: [] };
                data.goals.forEach((goal) => {
                    const formattedGoal = {
                        id: goal.id,
                        title: goal.title,
                        exp: goal.exp_reward,
                        description: goal.description,
                        done: goal.status === "completed",
                        type: goal.type,
                    };
                    if (grouped[goal.type]) grouped[goal.type].push(formattedGoal);
                });
                setGoalsData(grouped);
            } catch (err) {
                console.error("Error fetching goals:", err);
            }
        };
        fetchGoals();
    }, [userId]);

    useEffect(() => {
        const fetchCharacter = async () => {
            try {
                const data = await getCharacter({ user_id: userId });
                if (data.character) {
                    setCharacter(data.character);
                    setExpPercent((data.character.exp / data.character.next_level_exp) * 100);
                }
            } catch (err) {
                console.error("Error fetching character:", err);
            }
        };
        fetchCharacter();
    }, [userId]);

    // Handle completing a goal
    const handleCompleteGoal = async (goal, checked) => {
        const expGained = checked ? goal.exp : -goal.exp;
        let levelUp = false;

        // Update character locally
        setCharacter((prev) => {
            let newExp = prev.exp + expGained;
            let newLevel = prev.level;
            let newNextLevelExp = prev.next_level_exp;

            while (newExp >= newNextLevelExp) {
                newExp -= newNextLevelExp;
                newLevel += 1;
                newNextLevelExp = Math.floor(newNextLevelExp * 1.2);
                levelUp = true;
            }

            setExpPercent((newExp / newNextLevelExp) * 100);
            return { ...prev, exp: newExp, level: newLevel, next_level_exp: newNextLevelExp };
        });

        if (levelUp) {
            setIsLevelUp(true);
            setTimeout(() => setIsLevelUp(false), 5000);
            toast.success("Chúc mừng! Bạn đã lên cấp!");
        }

        setGoalsData((prev) => ({
            ...prev,
            [goalType]: prev[goalType].map((g) =>
                g.id === goal.id ? { ...g, done: checked } : g
            ),
        }));

        // Sync backend asynchronously
        try {
            await completeGoal({ goal_id: goal.id, user_id: userId });
            toast.success(checked ? "Hoàn thành mục tiêu!" : "Hoàn lại mục tiêu!");
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("data");
        navigate("/auth");
    };
    const levelImages = {
        1: lv1,
        2: lv2,
        3: lv3,
        4: lv4,
        5: lv5,
        6: lv6,
        7: lv7,
        8: lv8,
        9: lv9,
        10: lv10,
        11: lv11,
        12: lv12,
        13: lv13,
    };
    const COLORS = ["#82ca9d", "#8884d8", "#ff7300"];

    return (
        <div className="px-6 py-6 space-y-4">
            {/* Header với menu */}

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Mục tiêu của riêng bạn</h1>
                <Sheet>
                    <SheetTrigger asChild>
                        <Avatar className="cursor-pointer">
                            {info.avatarUrl ? ( // Nếu có URL hình ảnh
                                <img src={info.avatarUrl} alt={info.display_name} />
                            ) : null}
                            <AvatarFallback>
                                {info.display_name
                                    ? info.display_name
                                        .split(" ")
                                        .map((word) => word[0])
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase()
                                    : "NN"}
                            </AvatarFallback>
                        </Avatar>
                    </SheetTrigger>
                    <SheetContent side="right" className="flex flex-col justify-between">
                        <div>
                            <SheetHeader>
                                <SheetTitle>Thông tin tài khoản</SheetTitle>
                                <SheetDescription>Quản lý tài khoản và cài đặt cá nhân</SheetDescription>
                            </SheetHeader>
                            <div className="mt-6 flex flex-col items-center text-center">
                                <Avatar className="w-20 h-20">
                                    <AvatarFallback>
                                        {info.display_name
                                            ? info.display_name
                                                .split(" ")
                                                .map((word) => word[0])
                                                .join("")
                                                .slice(0, 2)
                                                .toUpperCase()
                                            : "NN"}
                                    </AvatarFallback>
                                </Avatar>
                                <h2 className="mt-3 text-lg font-semibold">{info.display_name}</h2>
                                <p className="text-sm text-muted-foreground">{info.email}</p>
                            </div>
                            <div className="mt-6 mx-2">
                                <Button variant="outline" className="w-full justify-start">
                                    <User className="mr-2 h-4 w-4" /> Thiết lập thông tin
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-red-500 hover:text-red-600 mt-2"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
                                </Button>
                            </div>
                        </div>

                    </SheetContent>
                </Sheet>
            </div>

            {/* Grid Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Character Panel */}
                <Card>
                    <CardHeader>
                        <CardTitle>Nhân vật của bạn</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">

                        <img
                            src={`${levelImages[character.level]}?t=${Date.now()}`} // thêm query param
                            alt={`Level ${character.level}`}
                            width={150}
                            height={150}
                            className="mb-4"
                        />


                        <p className="text-lg font-semibold">Level {character.level}</p>
                        <Progress value={expPercent} className="w-full my-2" />
                        <p>
                            {character.exp} / {character.next_level_exp} EXP
                        </p>
                        <Button variant="outline" className="mt-4">
                            Đổi Skin
                        </Button>
                    </CardContent>
                </Card>

                {/* Goals Panel */}
                <Card>
                    <CardHeader>
                        <CardTitle>Mục tiêu</CardTitle>
                        <GoalDialog
                            onCreate={async () => {
                                // Fetch only once, local update sau
                                try {
                                    const data = await getGoals({ status: "pending", user_id: userId });
                                    const grouped = { daily: [], weekly: [], monthly: [] };
                                    data.goals.forEach((goal) => {
                                        const formattedGoal = {
                                            id: goal.id,
                                            title: goal.title,
                                            exp: goal.exp_reward,
                                            description: goal.description,
                                            done: goal.status === "completed",
                                            type: goal.type,
                                        };
                                        if (grouped[goal.type]) grouped[goal.type].push(formattedGoal);
                                    });
                                    setGoalsData(grouped);
                                } catch (err) {
                                    console.error(err);
                                }
                            }}
                        />
                    </CardHeader>
                    <CardContent>
                        <Tabs value={goalType} onValueChange={setGoalType}>
                            <TabsList className="mb-4">
                                <TabsTrigger value="daily">Hàng ngày</TabsTrigger>
                                <TabsTrigger value="weekly">Hàng tuần</TabsTrigger>
                                <TabsTrigger value="monthly">Hàng tháng</TabsTrigger>
                            </TabsList>

                            {Object.entries(goalsData).map(([type, goals]) => (
                                <TabsContent key={type} value={type}>
                                    <div className="max-h-60 overflow-y-auto">
                                        <ul className="space-y-2">
                                            <AnimatePresence>
                                                {goals.map((goal) =>
                                                    !goal.done ? (
                                                        <motion.li
                                                            key={goal.id}
                                                            className="flex items-center justify-between"
                                                            initial={{ opacity: 0, y: -20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={goal.done}
                                                                    onChange={(e) => handleCompleteGoal(goal, e.target.checked)}
                                                                />
                                                                <div className="flex flex-col ml-2">
                                                                    <span>{goal.title}</span>
                                                                    {goal.description && (
                                                                        <span className="text-xs text-muted-foreground">{goal.description}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <span className="text-sm text-muted-foreground">+{goal.exp} EXP</span>
                                                                <EditGoalDialog
                                                                    goal={goal}
                                                                    onSave={(updatedGoal) => {
                                                                        setGoalsData((prev) => ({
                                                                            ...prev,
                                                                            [goalType]: prev[goalType].map((g) =>
                                                                                g.id === updatedGoal.id ? updatedGoal : g
                                                                            ),
                                                                        }));
                                                                    }}
                                                                />
                                                            </div>
                                                        </motion.li>
                                                    ) : null
                                                )}
                                            </AnimatePresence>
                                        </ul>
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            {/* EXP Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Thống kê EXP & tiến độ</CardTitle>
                </CardHeader>
                <CardContent className="px-2 py-4 md:py-6 h-auto">
                    <div className="flex flex-col md:flex-row gap-4 h-full">
                        {/* Biểu đồ EXP */}
                        <div className="w-full md:w-3/4 h-64 md:h-80 lg:h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={expData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="exp" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Biểu đồ tròn / donut */}
                        <div className="w-full md:w-1/4 h-64 md:h-80 lg:h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={50}
                                        innerRadius={20}
                                        fill="#8884d8"
                                        label
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend verticalAlign="bottom" height={36} />
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </CardContent>
            </Card>


            {isLevelUp && (
                <Confetti
                    width={width}
                    height={height}
                    numberOfPieces={500}
                    recycle={true}
                    gravity={0.6}
                />
            )}
        </div>
    );
}
