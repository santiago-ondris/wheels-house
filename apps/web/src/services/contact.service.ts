import { apiRequest } from "./api";

export interface ContactMessage {
    contactMessageId: number;
    name: string;
    email: string;
    reason: string;
    message: string;
    userId: number | null;
    status: 'PENDING' | 'READ' | 'RESOLVED';
    createdAt: string;
    adminNotes: string | null;
    archived?: boolean;
    archivedAt?: string | null;
}

export interface AdminMessagesResponse {
    data: ContactMessage[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const contactService = {
    async sendMessage(data: {
        name: string;
        email: string;
        reason: string;
        message: string;
        honeypot?: string;
    }) {
        return apiRequest<{ success: boolean }>('/contact', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async getAdminMessages(options: { page?: number, limit?: number, status?: string, archived?: boolean } = {}) {
        const params = new URLSearchParams();
        if (options.page) params.set('page', options.page.toString());
        if (options.limit) params.set('limit', options.limit.toString());
        if (options.status) params.set('status', options.status);
        if (options.archived !== undefined) params.set('archived', options.archived.toString());

        const query = params.toString();
        return apiRequest<AdminMessagesResponse>(`/admin/contact${query ? `?${query}` : ''}`);
    },

    async updateMessageStatus(id: number, status: string, adminNotes?: string) {
        return apiRequest<{ success: boolean }>(`/admin/contact/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status, adminNotes }),
        });
    },

    async archiveMessage(id: number, archived: boolean) {
        return apiRequest<{ success: boolean }>(`/admin/contact/${id}/archive`, {
            method: 'PATCH',
            body: JSON.stringify({ archived }),
        });
    }
};
