"use client";

import { useState, useEffect } from "react";
import { getAllUsers, updateUser, deleteUser } from "@/lib/actions/users";
import { getDojos } from "@/lib/actions/dojos";
import { SwipeBackWrapper } from "@/components/admin/AdminNavigation";
import { UserEditModal } from "@/components/admin/UserEditModal";
import { Button } from "@/components/ui/Button";
import { Loader2, Shield, ShieldAlert, BadgeCheck, Search, Pencil, UserCog, Trash2 } from "lucide-react";
import Image from "next/image";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [dojos, setDojos] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingUser, setEditingUser] = useState<any | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        const data = await getAllUsers();
        setUsers(data);
        const dojosRes = await getDojos();
        if (dojosRes.success) {
            setDojos(dojosRes.data || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateUser = async (userId: string, data: { name: string; email: string; role: string; isActive?: boolean; dojo?: string | null }) => {
        // Optimistic update
        setUsers(prev => prev.map(u =>
            u._id === userId ? { ...u, ...data } : u
        ));

        await updateUser(userId, data);
        setEditingUser(null);
        fetchData(); // Sync to be safe
    };

    const handleDeleteUser = async (userId: string, userName: string) => {
        if (window.confirm(`¿Estás SEGURO de que quieres eliminar a ${userName}? Esta acción no se puede deshacer.`)) {
            // Optimistic update
            setUsers(prev => prev.filter(u => u._id !== userId));

            const res = await deleteUser(userId);
            if (!res.success) {
                alert("Error al eliminar usuario");
                fetchData(); // Revert on error
            }
        }
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
                                                            {user.email?.startsWith("pendiente_") ? (
                                                                <span className="inline-block px-2 py-0.5 rounded bg-red-950/40 text-red-400 text-[9px] font-bold uppercase tracking-wider border border-red-900/30">
                                                                    Correo Pendiente
                                                                </span>
                                                            ) : (
                                                                <p className="text-zinc-500 text-[10px] truncate max-w-[250px]">{user.email}</p>
                                                            )}
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
                                                                <ShieldAlert className="w-3 h-3" /> Super Admin
                                                            </span>
                                                        ) : user.role === "admin" ? (
                                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-900/30 text-orange-400 text-[10px] font-bold uppercase border border-orange-900/50" title={user.dojo?.name ? `Dojo: ${user.dojo.name}` : undefined}>
                                                                🏢 Admin: {user.dojo?.name || "Sin Dojo"}
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
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            onClick={() => setEditingUser(user)}
                                                            size="sm"
                                                            className="h-8 w-8 p-0 bg-zinc-800 hover:bg-white hover:text-black text-white rounded-lg flex items-center justify-center transition-colors shadow-lg shadow-zinc-900/50"
                                                            title="Editar"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleDeleteUser(user._id, user.name)}
                                                            size="sm"
                                                            className="h-8 w-8 p-0 bg-red-900/20 hover:bg-red-600 text-red-500 hover:text-white border border-red-900/50 rounded-lg flex items-center justify-center transition-colors shadow-lg shadow-red-900/20"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
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
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {user.role === "super_admin" ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-900/30 text-red-400 text-[10px] font-bold uppercase border border-red-900/50">
                                                            <ShieldAlert className="w-3 h-3" /> Super Admin
                                                        </span>
                                                    ) : user.role === "admin" ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-900/30 text-orange-400 text-[10px] font-bold uppercase border border-orange-900/50">
                                                            🏢 Admin: {user.dojo?.name || "Sin Dojo"}
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
                                            {user.email?.startsWith("pendiente_") ? (
                                                <span className="px-2 py-0.5 rounded bg-red-950/40 text-red-400 text-[9px] font-bold uppercase tracking-wider border border-red-900/30">
                                                    Pendiente
                                                </span>
                                            ) : (
                                                <span className="text-zinc-300 truncate max-w-[200px]">{user.email}</span>
                                            )}
                                        </div>

                                        <div className="flex gap-3">
                                            <Button
                                                onClick={() => setEditingUser(user)}
                                                className="flex-1 bg-zinc-800 hover:bg-white hover:text-black text-white py-6 px-4 rounded-lg flex items-center justify-center transition-colors"
                                            >
                                                <Pencil className="w-5 h-5" />
                                            </Button>
                                            <Button
                                                onClick={() => handleDeleteUser(user._id, user.name)}
                                                className="flex-1 bg-red-900/20 hover:bg-red-600 text-red-500 hover:text-white py-6 px-4 rounded-lg border border-red-900/50 flex items-center justify-center transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
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
                        dojos={dojos}
                    />
                )}

            </div>
        </SwipeBackWrapper >
    );
}
