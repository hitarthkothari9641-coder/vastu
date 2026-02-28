/**
 * BuildBid Frontend API Service
 * Connects to the Python Flask backend
 * Falls back to mock data when backend is unavailable
 */

const API_BASE = 'http://localhost:5000/api';

interface ApiResponse<T = unknown> {
  data: T;
  error?: string;
}

class BuildBidAPI {
  private token: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.token = localStorage.getItem('bb_token');
    this.refreshToken = localStorage.getItem('bb_refresh_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 && this.refreshToken) {
          const refreshed = await this.refreshAccessToken();
          if (refreshed) {
            return this.request(endpoint, options);
          }
        }
        return { data: data as T, error: data.error || 'Request failed' };
      }

      return { data };
    } catch {
      return { data: {} as T, error: 'Network error - Backend may be offline' };
    }
  }

  // ─── AUTH ─────────────────────────────────────────────

  async register(userData: {
    email: string;
    password: string;
    full_name: string;
    role: string;
    phone?: string;
    company_name?: string;
    location?: string;
    services?: string[];
    gst_number?: string;
  }) {
    const result = await this.request<{
      user: Record<string, unknown>;
      access_token: string;
      refresh_token: string;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (!result.error && result.data.access_token) {
      this.setTokens(result.data.access_token, result.data.refresh_token);
    }
    return result;
  }

  async login(email: string, password: string) {
    const result = await this.request<{
      user: Record<string, unknown>;
      access_token: string;
      refresh_token: string;
      company?: Record<string, unknown>;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (!result.error && result.data.access_token) {
      this.setTokens(result.data.access_token, result.data.refresh_token);
    }
    return result;
  }

  async getCurrentUser() {
    return this.request<Record<string, unknown>>('/auth/me');
  }

  private async refreshAccessToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.refreshToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        this.token = data.access_token;
        localStorage.setItem('bb_token', data.access_token);
        return true;
      }
    } catch {
      // ignore
    }
    this.logout();
    return false;
  }

  private setTokens(access: string, refresh: string) {
    this.token = access;
    this.refreshToken = refresh;
    localStorage.setItem('bb_token', access);
    localStorage.setItem('bb_refresh_token', refresh);
  }

  logout() {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('bb_token');
    localStorage.removeItem('bb_refresh_token');
  }

  // ─── USERS ────────────────────────────────────────────

  async updateProfile(data: Record<string, unknown>) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getUserDashboard() {
    return this.request('/users/dashboard');
  }

  // ─── COMPANIES ────────────────────────────────────────

  async getCompanies(params?: {
    page?: number;
    search?: string;
    service?: string;
    city?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.search) query.set('search', params.search);
    if (params?.service) query.set('service', params.service);
    if (params?.city) query.set('city', params.city);
    return this.request(`/companies?${query}`);
  }

  async getCompany(id: number) {
    return this.request(`/companies/${id}`);
  }

  async updateCompanyProfile(data: Record<string, unknown>) {
    return this.request('/companies/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getCompanyDashboard() {
    return this.request('/companies/dashboard');
  }

  // ─── FEED ─────────────────────────────────────────────

  async getFeed(params?: { page?: number; category?: string }) {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.category) query.set('category', params.category);
    return this.request(`/feed?${query}`);
  }

  async createFeedPost(data: Record<string, unknown>) {
    return this.request('/feed', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async toggleLike(projectId: number) {
    return this.request(`/feed/${projectId}/like`, { method: 'POST' });
  }

  async toggleSave(projectId: number) {
    return this.request(`/feed/${projectId}/save`, { method: 'POST' });
  }

  // ─── QUOTATIONS ───────────────────────────────────────

  async getQuotations(params?: { page?: number; status?: string }) {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.status) query.set('status', params.status);
    return this.request(`/quotations?${query}`);
  }

  async createQuotation(data: Record<string, unknown>) {
    return this.request('/quotations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getQuotation(id: number) {
    return this.request(`/quotations/${id}`);
  }

  // ─── BIDS ─────────────────────────────────────────────

  async submitBid(data: {
    quotation_id: number;
    total_price: number;
    labor_cost: number;
    material_cost: number;
    overhead_cost: number;
    timeline_days: number;
    timeline_display: string;
    warranty_months: number;
    warranty_terms: string;
    scope_of_work?: string;
  }) {
    return this.request('/bids', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async acceptBid(bidId: number) {
    return this.request(`/bids/${bidId}/accept`, { method: 'POST' });
  }

  async rejectBid(bidId: number) {
    return this.request(`/bids/${bidId}/reject`, { method: 'POST' });
  }

  // ─── PROJECTS ─────────────────────────────────────────

  async getProjects(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.request(`/projects${query}`);
  }

  async getProject(id: number) {
    return this.request(`/projects/${id}`);
  }

  async completeMilestone(projectId: number, milestoneId: number) {
    return this.request(`/projects/${projectId}/milestone/${milestoneId}/complete`, {
      method: 'POST',
    });
  }

  // ─── MATERIALS ────────────────────────────────────────

  async getMaterials(params?: {
    category?: string;
    search?: string;
    city?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.city) query.set('city', params.city);
    return this.request(`/materials?${query}`);
  }

  async getMaterialHistory(id: number) {
    return this.request(`/materials/${id}/history`);
  }

  async getMaterialCategories() {
    return this.request('/materials/categories');
  }

  // ─── AI ESTIMATOR ─────────────────────────────────────

  async getAIEstimate(data: {
    service_type: string;
    area_sqft: number;
    quality_level: string;
    num_rooms: number;
    green_mode?: boolean;
  }) {
    return this.request('/ai-estimate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ─── REVIEWS ──────────────────────────────────────────

  async submitReview(data: {
    company_id: number;
    rating: number;
    title?: string;
    comment?: string;
    project_id?: number;
  }) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCompanyReviews(companyId: number, page?: number) {
    const query = page ? `?page=${page}` : '';
    return this.request(`/reviews/company/${companyId}${query}`);
  }

  // ─── CHAT ─────────────────────────────────────────────

  async getChatRooms() {
    return this.request('/chat/rooms');
  }

  async createChatRoom(companyId: number, quotationId?: number) {
    return this.request('/chat/rooms', {
      method: 'POST',
      body: JSON.stringify({ company_id: companyId, quotation_id: quotationId }),
    });
  }

  async getMessages(roomId: number) {
    return this.request(`/chat/rooms/${roomId}/messages`);
  }

  async sendMessage(roomId: number, message: string) {
    return this.request(`/chat/rooms/${roomId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // ─── NOTIFICATIONS ────────────────────────────────────

  async getNotifications(unreadOnly?: boolean) {
    const query = unreadOnly ? '?unread=true' : '';
    return this.request(`/notifications${query}`);
  }

  async markNotificationsRead(ids?: number[]) {
    return this.request('/notifications/read', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    });
  }

  // ─── ADMIN ────────────────────────────────────────────

  async getAdminStats() {
    return this.request('/admin/stats');
  }

  async getAdminUsers(params?: {
    page?: number;
    role?: string;
    status?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.role) query.set('role', params.role);
    if (params?.status) query.set('status', params.status);
    return this.request(`/admin/users?${query}`);
  }

  async toggleUserStatus(userId: number) {
    return this.request(`/admin/users/${userId}/toggle-status`, { method: 'POST' });
  }

  async verifyCompany(companyId: number, action: 'approve' | 'reject') {
    return this.request(`/admin/companies/verify/${companyId}`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    });
  }

  async getAdminReports(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.request(`/admin/reports${query}`);
  }

  async resolveReport(reportId: number, status: string, notes: string) {
    return this.request(`/admin/reports/${reportId}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ status, notes }),
    });
  }

  async getAdminProjects(params?: { page?: number; status?: string }) {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.status) query.set('status', params.status);
    return this.request(`/admin/projects?${query}`);
  }

  async getGrowthAnalytics() {
    return this.request('/admin/analytics/growth');
  }

  // ─── OTHER ────────────────────────────────────────────

  async getServices() {
    return this.request('/services');
  }

  async getSubscriptionPlans() {
    return this.request('/subscriptions/plans');
  }

  async healthCheck() {
    return this.request('/health');
  }
}

// Singleton instance
export const api = new BuildBidAPI();
export default api;
