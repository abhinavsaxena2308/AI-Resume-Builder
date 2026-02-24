import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    FileText,
    Settings,
    LogOut,
    Search,
    Bell,
    Plus,
    Download,
    Filter,
    MoreHorizontal,
    ChevronDown,
    LayoutDashboard,
    ShieldCheck,
    CreditCard,
    Settings2,
    Menu,
    X,
    User,
    ArrowRight,
    TrendingUp,
    Mail,
    Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Admin = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("users");

    const handleLogin = (e) => {
        e.preventDefault();
        if (email === "resume@admin.com" && password === "resume123") {
            setIsLoggedIn(true);
            toast.success("Welcome back, Admin!");
        } else {
            toast.error("Invalid credentials");
        }
    };

    const usersData = [
        { id: "USR-001", name: "John Doe", email: "john@example.com", joined: "2024-02-20", plan: "Premium", status: "Active", resumes: 5 },
        { id: "USR-002", name: "Jane Smith", email: "jane@example.com", joined: "2024-02-18", plan: "Free", status: "Active", resumes: 2 },
        { id: "USR-003", name: "Robert Fox", email: "robert@example.com", joined: "2024-02-15", plan: "Pro", status: "Inactive", resumes: 12 },
        { id: "USR-004", name: "Emily Davis", email: "emily@example.com", joined: "2024-02-10", plan: "Premium", status: "Active", resumes: 8 },
        { id: "USR-005", name: "Michael Chen", email: "michael@example.com", joined: "2024-02-05", plan: "Pro", status: "Active", resumes: 15 },
        { id: "USR-006", name: "Sarah Miller", email: "sarah@example.com", joined: "2024-02-01", plan: "Free", status: "Inactive", resumes: 1 },
    ];

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden font-sans">
                {/* Abstract Background Decorations */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 mb-4 shadow-lg shadow-purple-500/20">
                            <ShieldCheck className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h1>
                        <p className="text-gray-400 mt-2">Manage your AI Resume Builder ecosystem</p>
                    </div>

                    <Card className="bg-[#141414] border-[#222] shadow-2xl relative z-10">
                        <CardContent className="pt-8 px-8 pb-10">
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <Input
                                            type="email"
                                            placeholder="admin@example.com"
                                            className="bg-[#0f0f0f] border-[#222] text-white pl-10 h-12 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                                        <a href="#" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Forgot password?</a>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            className="bg-[#0f0f0f] border-[#222] text-white pl-10 h-12 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <Button className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/25 border-none transition-all duration-300 group">
                                    Sign In
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <p className="text-center text-gray-500 mt-8 text-sm">
                        &copy; 2024 AI Resume Builder. All rights reserved.
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-gray-200 flex overflow-hidden font-sans">
            {/* Sidebar - Inspired by the reference image */}
            <aside className={`
        ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-0 lg:translate-x-0 lg:w-20"} 
        fixed lg:static h-full bg-[#0a0a0a] border-r border-[#1a1a1a] transition-all duration-300 z-50 flex flex-col
      `}>
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-white" />
                    </div>
                    {sidebarOpen && <span className="font-bold text-xl tracking-tight text-white uppercase italic">Resume<span className="text-purple-500">AI</span></span>}
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1">
                    <SidebarItem icon={<LayoutDashboard />} label="Dashboard" active={activeTab === "dash"} onClick={() => setActiveTab("dash")} collapsed={!sidebarOpen} />
                    <SidebarItem icon={<Users />} label="Users" active={activeTab === "users"} onClick={() => setActiveTab("users")} collapsed={!sidebarOpen} />
                    <SidebarItem icon={<FileText />} label="Resumes" active={activeTab === "resumes"} onClick={() => setActiveTab("resumes")} collapsed={!sidebarOpen} />
                    <SidebarItem icon={<CreditCard />} label="Payments" active={activeTab === "billing"} onClick={() => setActiveTab("billing")} collapsed={!sidebarOpen} />

                    <div className="pt-4 pb-2">
                        {sidebarOpen && <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Management</p>}
                    </div>

                    <SidebarItem icon={<ShieldCheck />} label="Roles" collapsed={!sidebarOpen} />
                    <SidebarItem icon={<TrendingUp />} label="Analytics" collapsed={!sidebarOpen} />
                    <SidebarItem icon={<Settings2 />} label="Config" collapsed={!sidebarOpen} />
                </nav>

                <div className="p-4 border-t border-[#1a1a1a]">
                    <SidebarItem icon={<Settings />} label="Settings" collapsed={!sidebarOpen} />
                    <SidebarItem
                        icon={<LogOut />}
                        label="Logout"
                        onClick={() => setIsLoggedIn(false)}
                        danger
                        collapsed={!sidebarOpen}
                    />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-auto">
                {/* Top Header */}
                <header className="h-16 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#1a1a1a] px-8 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-4 flex-1">
                        <Button variant="ghost" size="icon" className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            <Menu className="w-5 h-5" />
                        </Button>
                        <div className="relative max-w-sm w-full hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input
                                placeholder="Search users, resumes, activity..."
                                className="bg-[#111] border-[#222] pl-10 h-9 text-sm focus:ring-purple-500/20"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                            <Bell className="w-5 h-4" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full border-2 border-[#0a0a0a]" />
                        </button>
                        <div className="h-8 w-[1px] bg-[#1a1a1a] mx-2" />
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-white leading-none">Admin User</p>
                                <p className="text-[11px] text-gray-500 mt-1">Super Admin</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center border border-[#333]">
                                <User className="w-5 h-5 text-gray-300" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-white tracking-tight">User Management</h2>
                            <p className="text-gray-400 mt-1">Review and manage all registered users in the system.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="bg-[#0a0a0a] border-[#222] text-gray-300 hover:bg-[#111]">
                                <Download className="w-4 h-4 mr-2" />
                                Export CSV
                            </Button>
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20">
                                <Plus className="w-4 h-4 mr-2" />
                                Add User
                            </Button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatsCard title="Total Users" value="1,284" change="+12.5%" icon={<Users className="text-blue-500" />} />
                        <StatsCard title="Active Resumes" value="4,592" change="+18.2%" icon={<FileText className="text-purple-500" />} />
                        <StatsCard title="Monthly Revenue" value="$12,450" change="+5.4%" icon={<CreditCard className="text-emerald-500" />} />
                        <StatsCard title="Conversion Rate" value="24.8%" change="+2.1%" icon={<TrendingUp className="text-orange-500" />} />
                    </div>

                    {/* Table Area - Inspired by the reference image */}
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-[#1a1a1a] flex flex-wrap items-center justify-between gap-4 bg-[#0d0d0d]">
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                                <TabButton active label="All Users" count="1,284" />
                                <TabButton label="Active" />
                                <TabButton label="Inactive" />
                                <TabButton label="Premium" />
                                <TabButton label="Pro" />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                                    <Input
                                        placeholder="Search..."
                                        className="bg-[#111] border-[#222] pl-9 h-9 w-48 text-xs focus:ring-purple-500/20"
                                    />
                                </div>
                                <Button variant="outline" size="sm" className="bg-[#111] border-[#222] text-xs h-9">
                                    <Filter className="w-3.5 h-3.5 mr-2" />
                                    Filters
                                    <ChevronDown className="w-3.5 h-3.5 ml-2 opacity-50" />
                                </Button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#0d0d0d] text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                                        <th className="px-6 py-4 border-b border-[#1a1a1a]">User ID</th>
                                        <th className="px-6 py-4 border-b border-[#1a1a1a]">Customer</th>
                                        <th className="px-6 py-4 border-b border-[#1a1a1a]">Date Joined</th>
                                        <th className="px-6 py-4 border-b border-[#1a1a1a]">Plan</th>
                                        <th className="px-6 py-4 border-b border-[#1a1a1a]">Status</th>
                                        <th className="px-6 py-4 border-b border-[#1a1a1a]">Resumes</th>
                                        <th className="px-6 py-4 border-b border-[#1a1a1a] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1a1a1a]">
                                    {usersData.map((user) => (
                                        <tr key={user.id} className="hover:bg-[#111]/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="text-gray-400 font-mono text-xs">{user.id}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold text-xs">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white leading-none">{user.name}</p>
                                                        <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-400">{user.joined}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className={`
                          ${user.plan === "Premium" ? "border-amber-500/50 text-amber-500 bg-amber-500/5" :
                                                        user.plan === "Pro" ? "border-purple-500/50 text-purple-500 bg-purple-500/5" :
                                                            "border-gray-500/50 text-gray-400 bg-gray-500/5"}
                          text-[10px] px-2 py-0.5 font-medium
                        `}>
                                                    {user.plan}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === "Active" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-gray-600"}`} />
                                                    <span className={`text-[13px] ${user.status === "Active" ? "text-emerald-500" : "text-gray-500"}`}>{user.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-400">{user.resumes}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-white hover:bg-[#222]">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-4 border-t border-[#1a1a1a] flex items-center justify-between text-xs text-gray-500">
                            <p>Showing 6 of 1,284 results</p>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="h-8 bg-[#111] border-[#222] disabled:opacity-30">Previous</Button>
                                <Button variant="outline" size="sm" className="h-8 bg-[#111] border-[#222]">Next</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const SidebarItem = ({ icon, label, active = false, onClick, danger = false, collapsed = false }) => (
    <button
        onClick={onClick}
        className={`
      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group
      ${active ? "bg-purple-600/10 text-purple-400" : "text-gray-500 hover:bg-[#151515] hover:text-gray-300"}
      ${danger ? "hover:bg-red-500/10 hover:text-red-400" : ""}
    `}
    >
        <div className={`shrink-0 ${active ? "text-purple-400" : "group-hover:text-gray-300 transition-colors"}`}>
            {React.cloneElement(icon, { size: 20 })}
        </div>
        {!collapsed && <span className="text-sm font-medium tracking-wide">{label}</span>}
        {active && !collapsed && <div className="ml-auto w-1 h-1 rounded-full bg-purple-400" />}
    </button>
);

const StatsCard = ({ title, value, change, icon }) => (
    <Card className="bg-[#0a0a0a] border-[#1a1a1a] hover:border-[#222] transition-colors overflow-hidden group">
        <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>
                <Badge variant="outline" className="border-emerald-500/20 text-emerald-500 bg-emerald-500/5 text-[10px]">
                    {change}
                </Badge>
            </div>
            <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</h3>
                <p className="text-2xl font-bold text-white mt-1">{value}</p>
            </div>
            <div className="mt-4 h-1 w-full bg-[#111] rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "65%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                />
            </div>
        </CardContent>
    </Card>
);

const TabButton = ({ label, count, active = false }) => (
    <button className={`
    px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border-b-2
    ${active ? "text-purple-400 border-purple-500" : "text-gray-500 border-transparent hover:text-gray-300"}
  `}>
        {label}
        {count && <span className="bg-[#1a1a1a] text-[10px] px-1.5 py-0.5 rounded-md text-gray-400">{count}</span>}
    </button>
);

export default Admin;
