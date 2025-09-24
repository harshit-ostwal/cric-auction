import { roles } from "@/lib/permission";

export function hasPermission(role, action) {
    if (!roles[role]) return false;
    return roles[role].includes(action);
}
