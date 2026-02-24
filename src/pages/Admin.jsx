import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
    Lock,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Admin = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("users");
    const [isVerifying, setIsVerifying] = useState(true);

    const isLoggedIn = localStorage.getItem("isAdmin") === "true";

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVerifying(false);
            if (!isLoggedIn) {
                toast.error("Unauthorized access. Please login as admin.");
                navigate("/auth");
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [isLoggedIn, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("isAdmin");
        toast.success("Logged out from admin portal");
        navigate("/auth");
    };

    const usersData = [
        { id: "USR-001", name: "John Doe", email: "john@example.com", joined: "2024-02-20", plan: "Premium", status: "Active", resumes: 5 },
        { id: "USR-002", name: "Jane Smith", email: "jane@example.com", joined: "2024-02-18", plan: "Free", status: "Active", resumes: 2 },
        { id: "USR-003", name: "Robert Fox", email: "robert@example.com", joined: "2024-02-15", plan: "Pro", status: "Inactive", resumes: 12 },
        { id: "USR-004", name: "Emily Davis", email: "emily@example.com", joined: "2024-02-10", plan: "Premium", status: "Active", resumes: 8 },
        { id: "USR-005", name: "Michael Chen", email: "michael@example.com", joined: "2024-02-05", plan: "Pro", status: "Active", resumes: 15 },
        { id: "USR-006", name: "Sarah Miller", email: "sarah@example.com", joined: "2024-02-01", plan: "Free", status: "Inactive", resumes: 1 },
    ];

    if (isVerifying || !isLoggedIn) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <Loader2 className="w-10 h-10 text-purple-500 animate-spin mx-auto" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Verifying administrator access...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-gray-200 flex overflow-hidden font-sans transition-colors duration-300">
            {/* Sidebar - Reverted visual changes, focused on positioning */}
            <aside className={`
        ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-0 lg:translate-x-0 lg:w-20"} 
        fixed lg:relative h-full bg-white dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-[#1a1a1a] transition-all duration-300 z-50 flex flex-col
      `}>
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    {sidebarOpen && <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white uppercase italic">Admin<span className="text-purple-500">Panel</span></span>}
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto no-scrollbar">
                    <SidebarItem icon={<LayoutDashboard />} label="Dashboard" active={activeTab === "dash"} onClick={() => setActiveTab("dash")} collapsed={!sidebarOpen} />
                    <SidebarItem icon={<Users />} label="Users" active={activeTab === "users"} onClick={() => setActiveTab("users")} collapsed={!sidebarOpen} />
                    <SidebarItem icon={<FileText />} label="Resumes" active={activeTab === "resumes"} onClick={() => setActiveTab("resumes")} collapsed={!sidebarOpen} />
                    <SidebarItem icon={<CreditCard />} label="Payments" active={activeTab === "billing"} onClick={() => setActiveTab("billing")} collapsed={!sidebarOpen} />

                    <div className="pt-4 pb-2">
                        {sidebarOpen && <p className="px-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Management</p>}
                    </div>

                    <SidebarItem icon={<TrendingUp />} label="Analytics" collapsed={!sidebarOpen} />
                    <SidebarItem icon={<Settings2 />} label="Config" collapsed={!sidebarOpen} />
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-[#1a1a1a]">
                    <SidebarItem icon={<Settings />} label="Settings" collapsed={!sidebarOpen} />
                    <SidebarItem
                        icon={<LogOut />}
                        label="Logout"
                        onClick={handleLogout}
                        danger
                        collapsed={!sidebarOpen}
                    />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-200 dark:border-[#1a1a1a] px-8 flex items-center justify-between sticky top-0 z-40 shrink-0">
                    <div className="flex items-center gap-4 flex-1">
                        <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            <Menu className="w-5 h-5" />
                        </Button>
                        <div className="relative max-w-sm w-full hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search database..."
                                className="bg-gray-100 dark:bg-[#111] border-gray-200 dark:border-[#222] pl-10 h-9 text-sm focus:ring-purple-500/20 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white transition-colors">
                            <Bell className="w-5 h-4" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full border-2 border-white dark:border-[#0a0a0a]" />
                        </button>
                        <div className="h-8 w-[1px] bg-gray-200 dark:bg-[#1a1a1a] mx-2" />
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-900 dark:text-white leading-none">Super Admin</p>
                                <p className="text-[11px] text-gray-500 mt-1">Full Access</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center border border-gray-300 dark:border-[#333]">
                                <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Scrollable Body */}
                <div className="flex-1 overflow-auto p-8 space-y-8">
                    <div className="max-w-7xl mx-auto w-full space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col md:flex-row md:items-end justify-between gap-4"
                        >
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">System Users</h2>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">Review and manage your application user base.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button variant="outline" className="bg-white dark:bg-[#0a0a0a] border-gray-200 dark:border-[#222] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111]">
                                    <Download className="w-4 h-4 mr-2" />
                                    Export Data
                                </Button>
                                <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20">
                                    <Plus className="w-4 h-4 mr-2" />
                                    New Admin
                                </Button>
                            </div>
                        </motion.div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatsCard title="Total Users" value="1,284" change="+12.5%" icon={<Users className="text-blue-500" />} />
                            <StatsCard title="Active Resumes" value="4,592" change="+18.2%" icon={<FileText className="text-purple-500" />} />
                            <StatsCard title="Monthly Revenue" value="$12,450" change="+5.4%" icon={<CreditCard className="text-emerald-500" />} />
                            <StatsCard title="Conversion Rate" value="24.8%" change="+2.1%" icon={<TrendingUp className="text-orange-500" />} />
                        </div>

                        {/* Table Area */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] rounded-xl overflow-hidden shadow-sm"
                        >
                            <div className="p-4 border-b border-gray-200 dark:border-[#1a1a1a] flex flex-wrap items-center justify-between gap-4 bg-gray-50 dark:bg-[#0d0d0d]">
                                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                                    <TabButton active label="All Members" count="1,284" />
                                    <TabButton label="Subscribed" />
                                    <TabButton label="Free Tier" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" className="bg-white dark:bg-[#111] border-gray-200 dark:border-[#222] text-xs h-9 text-gray-600 dark:text-gray-300">
                                        <Filter className="w-3.5 h-3.5 mr-2" />
                                        Apply Filters
                                    </Button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-[#0d0d0d] text-gray-500 dark:text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                                            <th className="px-6 py-4 border-b border-gray-200 dark:border-[#1a1a1a]">ID</th>
                                            <th className="px-6 py-4 border-b border-gray-200 dark:border-[#1a1a1a]">User Profile</th>
                                            <th className="px-6 py-4 border-b border-gray-200 dark:border-[#1a1a1a]">Joined At</th>
                                            <th className="px-6 py-4 border-b border-gray-200 dark:border-[#1a1a1a]">Tier</th>
                                            <th className="px-6 py-4 border-b border-gray-200 dark:border-[#1a1a1a]">Status</th>
                                            <th className="px-6 py-4 border-b border-gray-200 dark:border-[#1a1a1a]">Assets</th>
                                            <th className="px-6 py-4 border-b border-gray-200 dark:border-[#1a1a1a] text-right">Menu</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-[#1a1a1a]">
                                        {usersData.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-[#111]/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <span className="text-gray-500 dark:text-gray-400 font-mono text-xs">{user.id}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-xs border border-purple-500/20">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white leading-none">{user.name}</p>
                                                            <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">{user.joined}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="outline" className={`
                            ${user.plan === "Premium" ? "border-amber-500/50 text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/5" :
                                                            user.plan === "Pro" ? "border-purple-500/50 text-purple-600 dark:text-purple-500 bg-purple-50 dark:bg-purple-500/5" :
                                                                "border-gray-300 dark:border-gray-500/50 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-500/5"}
                            text-[10px] px-2 py-0.5 font-medium
                          `}>
                                                        {user.plan}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === "Active" ? "bg-emerald-500" : "bg-gray-400 dark:bg-gray-600"}`} />
                                                        <span className={`text-[13px] ${user.status === "Active" ? "text-emerald-600 dark:text-emerald-500" : "text-gray-500"}`}>{user.status}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">{user.resumes} Resumes</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#222]">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-4 border-t border-gray-200 dark:border-[#1a1a1a] flex items-center justify-between text-xs text-gray-500 bg-gray-50 dark:bg-[#0d0d0d]">
                                <p>Total {usersData.length} records in this view</p>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" className="h-8 bg-white dark:bg-[#111] border-gray-200 dark:border-[#222]">Previous</Button>
                                    <Button variant="outline" size="sm" className="h-8 bg-white dark:bg-[#111] border-gray-200 dark:border-[#222]">Next</Button>
                                </div>
                            </div>
                        </motion.div>
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
      ${active ? "bg-purple-600/10 text-purple-600 dark:text-purple-400" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-[#151515] hover:text-gray-900 dark:hover:text-gray-300"}
      ${danger ? "hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400" : ""}
      ${collapsed ? "justify-center" : ""}
    `}
    >
        <div className={`shrink-0 ${active ? "text-purple-600 dark:text-purple-400" : "group-hover:text-gray-900 dark:group-hover:text-gray-300 transition-colors"}`}>
            {React.cloneElement(icon, { size: 18 })}
        </div>
        {!collapsed && <span className="text-sm font-medium tracking-wide">{label}</span>}
        {active && !collapsed && <div className="ml-auto w-1 h-1 rounded-full bg-purple-500 dark:bg-purple-400" />}
    </button>
);

const StatsCard = ({ title, value, change, icon }) => (
    <Card className="bg-white dark:bg-[#0a0a0a] border-gray-200 dark:border-[#1a1a1a] hover:border-gray-300 dark:hover:border-[#222] transition-colors overflow-hidden group">
        <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>
                <Badge variant="outline" className="border-emerald-500/20 text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/5 text-[10px]">
                    {change}
                </Badge>
            </div>
            <div>
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-widest">{title}</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
            </div>
        </CardContent>
    </Card>
);

const TabButton = ({ label, count, active = false }) => (
    <button className={`
    px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border-b-2
    ${active ? "text-purple-600 dark:text-purple-400 border-purple-600 dark:border-purple-500" : "text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300"}
  `}>
        {label}
        {count && <span className="bg-gray-100 dark:bg-[#1a1a1a] text-[10px] px-1.5 py-0.5 rounded-md text-gray-500 dark:text-gray-400">{count}</span>}
    </button>
);

export default Admin;
