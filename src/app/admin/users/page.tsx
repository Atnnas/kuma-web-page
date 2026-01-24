"use client";

import { useState, useEffect } from "react";
import { getAllUsers, updateUser } from "@/lib/actions/users";
import { SwipeBackWrapper } from "@/components/admin/AdminNavigation";
import { UserEditModal } from "@/components/admin/UserEditModal";
import { Button } from "@/components/ui/Button";
import { Loader2, Shield, ShieldAlert, BadgeCheck, Search, Pencil, UserCog } from "lucide-react";
import Image from "next/image";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingUser, setEditingUser] = useState<any | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        const data = await getAllUsers();
        setUsers(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateUser = async (userId: string, data: { name: string; email: string; role: string; isActive?: boolean }) => {
        // Optimistic update
        setUsers(prev => prev.map(u =>
            u._id === userId ? { ...u, ...data } : u
        ));

        await updateUser(userId, data);
        setEditingUser(null);
        fetchData(); // Sync to be safe
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <SwipeBackWrapper>
            <div className="w-full md:w-[98%] max-w-[1600px] mx-auto md:pr-4 py-8">
                {/* Search */}
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o correo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-4 pl-12 pr-6 text-white focus:border-red-500 focus:outline-none transition-colors"
                    />
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block glass border border-white/5 rounded-xl overflow-hidden backdrop-blur-md">
                            <div className="">
                                <table className="w-full text-left border-collapse table-fixed">
                                    <thead>
                                        <tr className="border-b border-zinc-800 bg-zinc-900/80">
                                            <th className="p-4 w-auto text-sm font-black text-white uppercase tracking-widest drop-shadow-md">Usuario</th>
                                            <th className="p-4 w-[100px] text-sm font-black text-white uppercase tracking-widest text-center drop-shadow-md">Estado</th>
                                            <th className="p-4 w-[120px] text-sm font-black text-white uppercase tracking-widest text-center drop-shadow-md">Rol</th>
                                            <th className="p-4 w-[120px] text-sm font-black text-white uppercase tracking-widest text-right drop-shadow-md">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user) => (
                                            <tr key={user._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-zinc-800 shrink-0">
                                                            {user.image ? (
                                                                <Image src={user.image} alt={user.name} fill className="object-cover" />
                                                            ) : (
                                                                <div className="flex items-center justify-center h-full text-xs font-bold text-zinc-500 w-full">
                                                                    {user.name?.[0]}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-black text-white text-lg truncate">{user.name}</p>
                                                            <p className="text-zinc-500 text-[10px] truncate max-w-[250px]">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className={`inline-block w-3 h-3 rounded-full ${user.isActive !== false ? "bg-green-500 shadow-[0_0_10px_#22c55e]" : "bg-red-600 shadow-[0_0_10px_#dc2626]"}`} title={user.isActive !== false ? "Activo" : "Inactivo"} />
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex justify-center">
                                                        {user.role === "super_admin" ? (
                                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-900/30 text-red-400 text-[10px] font-bold uppercase border border-red-900/50">
                                                                <ShieldAlert className="w-3 h-3" /> Admin
                                                            </span>
                                                        ) : user.role === "editor" ? (
                                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-900/30 text-amber-400 text-[10px] font-bold uppercase border border-amber-900/50">
                                                                <UserCog className="w-3 h-3" /> Editor
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase border border-zinc-700">
                                                                <Shield className="w-3 h-3" /> User
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <Button
                                                        onClick={() => setEditingUser(user)}
                                                        size="sm"
                                                        className="bg-zinc-800 hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-wider"
                                                    >
                                                        <Pencil className="w-3 h-3 mr-2" /> Editar
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-4">
                            {filteredUsers.map((user) => (
                                <div key={user._id} className="glass border border-white/5 rounded-xl p-4 flex flex-col gap-4 backdrop-blur-md">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-12 w-12 rounded-full overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700">
                                                {user.image ? (
                                                    <Image src={user.image} alt={user.name} fill className="object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-sm font-bold text-zinc-500 w-full">
                                                        {user.name?.[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white mb-0.5 flex items-center gap-2">
                                                    {user.name}
                                                    <span className={`w-2 h-2 rounded-full ${user.isActive !== false ? "bg-green-500" : "bg-red-600"}`} />
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    {user.role === "super_admin" ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-900/30 text-red-400 text-[10px] font-bold uppercase border border-red-900/50">
                                                            <ShieldAlert className="w-3 h-3" /> Admin
                                                        </span>
                                                    ) : user.role === "editor" ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-900/30 text-amber-400 text-[10px] font-bold uppercase border border-amber-900/50">
                                                            <UserCog className="w-3 h-3" /> Editor
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase border border-zinc-700">
                                                            <Shield className="w-3 h-3" /> User
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-3 border-t border-zinc-800/50">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-zinc-500 font-medium">Email</span>
                                            <span className="text-zinc-300 truncate max-w-[200px]">{user.email}</span>
                                        </div>

                                        <Button
                                            onClick={() => setEditingUser(user)}
                                            className="w-full bg-zinc-800 hover:bg-white hover:text-black text-white py-6 text-xs font-bold uppercase tracking-wider rounded-lg"
                                        >
                                            <Pencil className="w-4 h-4 mr-2" /> Editar Perfil
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Edit Modal */}
                {editingUser && (
                    <UserEditModal
                        isOpen={!!editingUser}
                        onClose={() => setEditingUser(null)}
                        user={editingUser}
                        onSave={handleUpdateUser}
                    />
                )}

            </div>
        </SwipeBackWrapper>
    );
}
