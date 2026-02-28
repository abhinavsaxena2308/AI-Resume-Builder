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
    Loader2,
    Home,
    AlertCircle,
    RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { API_BASE_URL } from "@/services/api";

const Admin = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("users");
    const [isVerifying, setIsVerifying] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Real data from API
    const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, totalResumes: 0, templateDistribution: {}, providerDistribution: {} });
    const [usersData, setUsersData] = useState([]);
    const [resumesData, setResumesData] = useState([]);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterTab, setFilterTab] = useState("all"); // "all", "active", "inactive"

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

    // Fetch admin data from API
    const fetchAdminData = async (silent = false) => {
        if (!silent) setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
                headers: {
                    "Content-Type": "application/json",
                    "X-Admin-Key": "resume-admin-verified",
                },
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.details || errData.error || `Server error ${response.status}`);
            }

            const data = await response.json();
            console.log('Admin data fetched:', data); // Debug log
            setStats(data.stats);
            setUsersData(data.users);
            const resumes = data.resumes || [];
            setResumesData(resumes);
            if (resumes.length === 0) {
                console.warn('No resumes returned from API');
                toast.warn('No resumes data available');
            }
            setLastUpdated(new Date().toLocaleTimeString());
        } catch (err) {
            console.error("Failed to fetch admin data:", err);
            setError(err.message);
            if (!silent) toast.error("Failed to load admin data: " + err.message);
        } finally {
            if (!silent) setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn && !isVerifying) {
            fetchAdminData();

            // Real-time polling every 30 seconds
            const interval = setInterval(() => {
                fetchAdminData(true);
            }, 30000);

            return () => clearInterval(interval);
        }
    }, [isLoggedIn, isVerifying]);

    // Debug: log resumes data changes
    useEffect(() => {
        console.log('Resumes data length:', resumesData.length);
    }, [resumesData]);

    const handleLogout = () => {
        localStorage.removeItem("isAdmin");
        toast.success("Logged out from admin portal");
        navigate("/auth");
    };

    // Filter users based on search and tab
    const filteredUsers = usersData.filter(user => {
        const query = searchQuery ? searchQuery.toLowerCase() : "";
        const matchesSearch =
            !searchQuery ||
            (user.name && user.name.toLowerCase().includes(query)) ||
            (user.email && user.email.toLowerCase().includes(query)) ||
            (user.id && user.id.toLowerCase().includes(query));

        const matchesTab =
            searchQuery ? true : // ignore tab filter when searching globally
                (filterTab === "all" ||
                    (filterTab === "active" && user.status === "Active") ||
                    (filterTab === "inactive" && user.status !== "Active"));

        return matchesSearch && matchesTab;
    });

    const filteredResumes = resumesData.filter(resume => {
        const query = searchQuery ? searchQuery.toLowerCase() : "";
        const matchesSearch =
            !searchQuery ||
            (resume.title && resume.title.toLowerCase().includes(query)) ||
            (resume.userName && resume.userName.toLowerCase().includes(query)) ||
            (resume.userEmail && resume.userEmail.toLowerCase().includes(query)) ||
            (resume.id && resume.id.toLowerCase().includes(query));
        return matchesSearch;
    });

    const activeCount = usersData.filter(u => u.status === "Active").length;
    const inactiveCount = usersData.filter(u => u.status !== "Active").length;

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

    const handleNavigation = (tab) => {
        setActiveTab(tab);
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-gray-200 flex overflow-hidden font-sans transition-colors duration-300">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64 lg:translate-x-0 lg:w-20"} 
        fixed lg:relative h-full bg-white dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-[#1a1a1a] transition-all duration-300 z-50 flex flex-col overflow-hidden
      `}>
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    {sidebarOpen && <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white uppercase italic">Admin<span className="text-pink-500">Panel</span></span>}
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto no-scrollbar">
                    <SidebarItem icon={<Home />} label="Home" onClick={() => navigate("/")} collapsed={!sidebarOpen} />
                    <SidebarItem icon={<LayoutDashboard />} label="Dashboard" active={activeTab === "dash"} onClick={() => handleNavigation("dash")} collapsed={!sidebarOpen} />
                    <SidebarItem icon={<Users />} label="Users" active={activeTab === "users"} onClick={() => handleNavigation("users")} collapsed={!sidebarOpen} />
                    <SidebarItem icon={<FileText />} label="Resumes" active={activeTab === "resumes"} onClick={() => handleNavigation("resumes")} collapsed={!sidebarOpen} />
                    <SidebarItem icon={<CreditCard />} label="Payments" active={activeTab === "billing"} onClick={() => handleNavigation("billing")} collapsed={!sidebarOpen} />

                    <div className="pt-4 pb-2">
                        {sidebarOpen && <p className="px-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Management</p>}
                    </div>

                    <SidebarItem icon={<TrendingUp />} label="Analytics" active={activeTab === "analytics"} onClick={() => handleNavigation("analytics")} collapsed={!sidebarOpen} />
                    <SidebarItem icon={<Settings2 />} label="Config" active={activeTab === "config"} onClick={() => handleNavigation("config")} collapsed={!sidebarOpen} />
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-[#1a1a1a]">
                    <SidebarItem icon={<Settings />} label="Settings" active={activeTab === "settings"} onClick={() => handleNavigation("settings")} collapsed={!sidebarOpen} />
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
                <header className="h-16 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-200 dark:border-[#1a1a1a] px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 shrink-0">
                    <div className="flex items-center gap-4 flex-1">
                        <Button variant="ghost" size="icon" className="shrink-0 text-gray-500 dark:text-gray-400" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            <Menu className="w-5 h-5" />
                        </Button>
                        <div className="relative w-full max-w-[200px] sm:max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-gray-100 dark:bg-[#111] border-gray-200 dark:border-[#222] pl-10 h-9 text-xs sm:text-sm focus:ring-purple-500/20 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {lastUpdated && (
                            <div className="hidden lg:flex items-center gap-2 text-[10px] text-gray-400 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-full border border-gray-100 dark:border-white/10">
                                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Synced {lastUpdated}</span>
                            </div>
                        )}
                        <button
                            onClick={() => fetchAdminData()}
                            className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white transition-colors shrink-0"
                            title="Refresh data"
                        >
                            <RefreshCw className={`w-5 h-4 ${isLoading ? "animate-spin" : ""}`} />
                        </button>
                        <div className="h-8 w-[1px] bg-gray-200 dark:bg-[#1a1a1a] mx-1 sm:mx-2 shrink-0" />
                        <div className="flex items-center gap-3 pl-1 sm:pl-2 shrink-0">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-900 dark:text-white leading-none">Super Admin</p>
                                <p className="text-[11px] text-gray-500 mt-1">Full Access</p>
                            </div>
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center border border-gray-300 dark:border-[#333]">
                                <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Scrollable Body */}
                <div className="flex-1 overflow-auto p-4 md:p-8 space-y-8 no-scrollbar">
                    <div className="max-w-7xl mx-auto w-full space-y-8">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col md:flex-row md:items-end justify-between gap-4"
                        >
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                    {activeTab === "dash" ? "Overview Dashboard" :
                                        activeTab === "users" ? "User Management" :
                                            activeTab === "resumes" ? "Resume Records" :
                                                activeTab === "billing" ? "Payment History" : "System Settings"}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">
                                    {activeTab === "dash" ? "Real-time system health and usage metrics." :
                                        activeTab === "users" ? "Manage and monitor application user base." :
                                            activeTab === "resumes" ? "Track all resumes generated across the platform." :
                                                activeTab === "billing" ? "Monitor subscription status and payments." : "Configure system parameters."}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {activeTab === "dash" && (
                                    <Badge variant="outline" className="bg-purple-500/5 border-purple-500/20 text-purple-600 dark:text-purple-400 px-3 py-1">
                                        Live Updates Active
                                    </Badge>
                                )}
                                <Button variant="outline" className="bg-white dark:bg-[#0a0a0a] border-gray-200 dark:border-[#222] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111]">
                                    <Download className="w-4 h-4 mr-2" />
                                    Export CSV
                                </Button>
                            </div>
                        </motion.div>

                        {/* Stats Cards Dashboard (Visible on multiple tabs or specific ones) */}
                        {activeTab === "dash" && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatsCard
                                    title="Total Users"
                                    value={isLoading ? "..." : stats.totalUsers.toLocaleString()}
                                    icon={<Users className="text-blue-500" />}
                                    loading={isLoading}
                                />
                                <StatsCard
                                    title="Active Users"
                                    value={isLoading ? "..." : stats.activeUsers.toLocaleString()}
                                    subtitle="Last 30 days"
                                    icon={<TrendingUp className="text-emerald-500" />}
                                    loading={isLoading}
                                />
                                <StatsCard
                                    title="Total Resumes"
                                    value={isLoading ? "..." : stats.totalResumes.toLocaleString()}
                                    icon={<FileText className="text-purple-500" />}
                                    loading={isLoading}
                                />
                                <StatsCard
                                    title="Avg Resumes/User"
                                    value={isLoading ? "..." : (stats.totalUsers > 0 ? (stats.totalResumes / stats.totalUsers).toFixed(1) : "0")}
                                    icon={<CreditCard className="text-orange-500" />}
                                    loading={isLoading}
                                />
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 rounded-xl p-4 flex items-center gap-3"
                            >
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-red-800 dark:text-red-400">Connection Interrupted</p>
                                    <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">{error}</p>
                                </div>
                                <Button size="sm" variant="outline" onClick={() => fetchAdminData()} className="border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10">
                                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                                    Retry
                                </Button>
                            </motion.div>
                        )}

                        {/* Tab Content Switching */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={searchQuery ? "search" : activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {searchQuery ? renderGlobalSearchResults() : (
                                    <>
                                        {activeTab === "dash" && renderDashboardOverview()}
                                        {activeTab === "users" && renderUsersTable()}
                                        {activeTab === "resumes" && renderResumesTable()}
                                        {(activeTab === "billing" || activeTab === "analytics" || activeTab === "config" || activeTab === "settings") && renderPlaceholder(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module Coming Soon`)}
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );

    // --- Content Renderers ---

    function renderDashboardOverview() {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Registration Distribution */}
                <Card className="bg-white dark:bg-[#0a0a0a] border-gray-200 dark:border-[#1a1a1a] overflow-hidden">
                    <CardHeader className="border-b border-gray-50 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-purple-500" />
                            Authentication Providers
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {Object.entries(stats.providerDistribution || {}).map(([provider, count]) => {
                                const percentage = stats.totalUsers > 0 ? (count / stats.totalUsers) * 100 : 0;
                                return (
                                    <div key={provider} className="space-y-2">
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-gray-600 dark:text-gray-400">{provider}</span>
                                            <span className="text-gray-900 dark:text-white">{count} ({percentage.toFixed(0)}%)</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className={`h-full rounded-full ${provider === "Google" ? "bg-blue-500" :
                                                    provider === "GitHub" ? "bg-gray-800 dark:bg-gray-400" : "bg-purple-500"
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Template Popularity */}
                <Card className="bg-white dark:bg-[#0a0a0a] border-gray-200 dark:border-[#1a1a1a] overflow-hidden">
                    <CardHeader className="border-b border-gray-50 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <LayoutDashboard className="w-4 h-4 text-blue-500" />
                            Resume Template Usage
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {Object.entries(stats.templateDistribution || {}).map(([template, count]) => {
                                const percentage = stats.totalResumes > 0 ? (count / stats.totalResumes) * 100 : 0;
                                return (
                                    <div key={template} className="space-y-2">
                                        <div className="flex justify-between text-xs font-medium uppercase tracking-tight">
                                            <span className="text-gray-600 dark:text-gray-400">{template}</span>
                                            <span className="text-gray-900 dark:text-white">{count} Resumes</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                                className="h-full bg-blue-500 rounded-full"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    function renderGlobalSearchResults() {
        return (
            <div className="space-y-8">
                <div className="mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Search className="w-5 h-5 text-purple-500" />
                        Search Results for "{searchQuery}"
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Found {filteredUsers.length} users and {filteredResumes.length} resumes</p>
                </div>

                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
                        Matching Users
                    </h4>
                    {renderUsersTable(true)}
                </div>

                <div className="space-y-4 mt-8">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
                        Matching Resumes
                    </h4>
                    {renderResumesTable(true)}
                </div>
            </div>
        );
    }

    function renderUsersTable(hideHeader = false) {
        return (
            <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] rounded-xl overflow-hidden shadow-sm">
                {!hideHeader && (
                    <div className="p-4 border-b border-gray-200 dark:border-[#1a1a1a] flex flex-wrap items-center justify-between gap-4 bg-gray-50 dark:bg-[#0d0d0d]">
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                            <TabButton
                                active={filterTab === "all"}
                                label="All Members"
                                count={usersData.length.toLocaleString()}
                                onClick={() => setFilterTab("all")}
                            />
                            <TabButton
                                active={filterTab === "active"}
                                label="Active"
                                count={activeCount.toLocaleString()}
                                onClick={() => setFilterTab("active")}
                            />
                            <TabButton
                                active={filterTab === "inactive"}
                                label="Inactive"
                                count={inactiveCount.toLocaleString()}
                                onClick={() => setFilterTab("inactive")}
                            />
                        </div>
                    </div>
                )}

                {isLoading ? renderLoadingState("Querying Firebase Auth...") : filteredUsers.length === 0 ? renderEmptyState("No users found") : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-[#0d0d0d] text-gray-500 dark:text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                                    <th className="px-6 py-4 border-b border-gray-200 dark:border-[#1a1a1a]">Identifier</th>
                                    <th className="px-6 py-4 border-b border-gray-200 dark:border-[#1a1a1a]">Providers</th>
                                    <th className="px-6 py-4 border-b border-gray-200 dark:border-[#1a1a1a]">Created</th>
                                    <th className="px-6 py-4 border-b border-gray-200 dark:border-[#1a1a1a]">Signed In</th>
                                    <th className="px-6 py-4 border-b border-gray-200 dark:border-[#1a1a1a]">User UID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-[#1a1a1a]">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-[#111]/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px] inline-block" title={user.email}>{user.email}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className={`
                                                ${user.provider === "google.com" ? "border-blue-500/50 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/5" :
                                                    user.provider === "github.com" ? "border-gray-500/50 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-500/5" :
                                                        "border-purple-500/50 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/5"}
                                                text-[10px] px-2 py-0.5 font-medium
                                            `}>
                                                {user.provider === "google.com" ? "Google" :
                                                    user.provider === "github.com" ? "GitHub" : "Email"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{user.joined}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{user.lastSignIn}</span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-[10px] text-gray-400">{user.id}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    }

    function renderResumesTable(hideHeader = false) {
        return (
            <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] rounded-xl overflow-hidden shadow-sm">
                {!hideHeader && (
                    <div className="p-4 border-b border-gray-200 dark:border-[#1a1a1a] space-y-4 bg-gray-50 dark:bg-[#0d0d0d]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-none px-2 py-0.5 text-xs font-bold">
                                    {resumesData.length} TOTAL
                                </Badge>
                            </div>
                        </div>
                    </div>
                )}

                {isLoading ? renderLoadingState("Fetching Firestore documents...") : filteredResumes.length === 0 ? renderEmptyState("No resumes found") : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-[#0d0d0d] text-gray-500 dark:text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                                    <th className="px-6 py-4 border-b border-gray-200 dark:border-[#1a1a1a]">Title / Resume ID</th>
                                    <th className="px-6 py-4 border-b border-gray-200 dark:border-[#1a1a1a]">Owner</th>
                                    <th className="px-6 py-4 border-b border-gray-200 dark:border-[#1a1a1a]">Template</th>
                                    <th className="px-6 py-4 border-b border-gray-200 dark:border-[#1a1a1a]">Sections</th>
                                    <th className="px-6 py-4 border-b border-gray-200 dark:border-[#1a1a1a]">Last Updated</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-[#1a1a1a]">
                                {filteredResumes.map((resume) => (
                                    <tr key={resume.id} className="hover:bg-gray-50 dark:hover:bg-[#111]/50 transition-colors group text-xs">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 dark:text-white mb-0.5">{resume.title || "Untitled Resume"}</span>
                                                <span className="text-[10px] text-gray-500 font-mono">{resume.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-700 dark:text-gray-300">{resume.userName || "Unknown User"}</span>
                                                <span className="text-[10px] text-gray-500">{resume.userEmail || "N/A"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className="text-[10px] capitalize border-gray-200 dark:border-gray-800">
                                                {resume.template || "default"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1">
                                                {resume.sections?.hasExperience && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Experience" />}
                                                {resume.sections?.hasEducation && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" title="Education" />}
                                                {resume.sections?.hasSkills && <div className="w-1.5 h-1.5 rounded-full bg-purple-500" title="Skills" />}
                                                {resume.sections?.hasSummary && <div className="w-1.5 h-1.5 rounded-full bg-orange-500" title="Summary" />}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{resume.updatedAt}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    }

    function renderPlaceholder(message) {
        return (
            <div className="bg-white dark:bg-[#0a0a0a] border border-dashed border-gray-300 dark:border-gray-800 rounded-2xl p-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center mx-auto mb-6">
                    <Loader2 className="w-8 h-8 text-gray-300 dark:text-gray-600 animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{message}</h3>
                <p className="text-gray-500 mt-2 max-w-sm mx-auto">We're currently building this module to give you deeper insights and control over your platform.</p>
                <Button variant="outline" className="mt-8 border-gray-200 dark:border-gray-800" onClick={() => setActiveTab("dash")}>Back to Dashboard</Button>
            </div>
        );
    }

    function renderLoadingState(message) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-3">
                    <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
                </div>
            </div>
        );
    }

    function renderEmptyState(message) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-3">
                    <Search className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
                </div>
            </div>
        );
    }
};




const SidebarItem = ({ icon, label, active = false, onClick, danger = false, collapsed = false }) => (
    <button
        onClick={onClick}
        className={`
      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group
      ${active ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-[#151515] hover:text-gray-900 dark:hover:text-gray-300"}
      ${danger ? "hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400" : ""}
      ${collapsed ? "justify-center" : ""}
    `}
    >
        <div className={`shrink-0 ${active ? "text-white" : "group-hover:text-gray-900 dark:group-hover:text-gray-300 transition-colors"}`}>
            {React.cloneElement(icon, { size: 18 })}
        </div>
        {!collapsed && <span className="text-sm font-medium tracking-wide">{label}</span>}
        {active && !collapsed && <div className="ml-auto w-1 h-1 rounded-full bg-white/80" />}
    </button>
);

const StatsCard = ({ title, value, subtitle, icon, loading }) => (
    <Card className="bg-white dark:bg-[#0a0a0a] border-gray-200 dark:border-[#1a1a1a] hover:border-gray-300 dark:hover:border-[#222] transition-colors overflow-hidden group">
        <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>
                {subtitle && (
                    <Badge variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-[10px]">
                        {subtitle}
                    </Badge>
                )}
            </div>
            <div>
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-widest">{title}</h3>
                <p className={`text-2xl font-bold text-gray-900 dark:text-white mt-1 ${loading ? "animate-pulse" : ""}`}>
                    {value}
                </p>
            </div>
        </CardContent>
    </Card>
);

const TabButton = ({ label, count, active = false, onClick }) => (
    <button
        onClick={onClick}
        className={`
    px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border-b-2
    ${active ? "text-purple-600 dark:text-purple-400 border-purple-600 dark:border-purple-500" : "text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300"}
  `}>
        {label}
        {count && <span className="bg-gray-100 dark:bg-[#1a1a1a] text-[10px] px-1.5 py-0.5 rounded-md text-gray-500 dark:text-gray-400">{count}</span>}
    </button>
);

export default Admin;
