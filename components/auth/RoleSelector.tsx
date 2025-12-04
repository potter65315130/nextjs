import React from 'react';

interface Role {
    value: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

interface RoleSelectorProps {
    roles: Role[];
    selectedRole: string;
    onRoleChange: (role: string) => void;
}

export const RoleSelector = ({ roles, selectedRole, onRoleChange }: RoleSelectorProps) => {
    return (
        <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">เลือกประเภทบัญชี</p>
            <div className="flex gap-4 justify-center">
                {roles.map((role) => {
                    const Icon = role.icon;
                    return (
                        <button
                            key={role.value}
                            onClick={() => onRoleChange(role.value)}
                            type="button"
                            className={`flex-1 py-4 rounded-xl flex flex-col items-center gap-2 transition-all ${selectedRole === role.value ? 'role-btn-active' : 'role-btn'}`}
                        >
                            <Icon className="w-6 h-6" />
                            <span className="font-medium text-sm">{role.label}</span>
                        </button>

                    );
                })}
            </div>
        </div>
    );
};