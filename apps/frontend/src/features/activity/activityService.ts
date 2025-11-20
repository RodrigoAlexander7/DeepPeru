import { api } from '@/lib/apis';
import type {
  Activity,
  CreateActivityDto,
  UpdateActivityDto,
  QueryActivityParams,
} from '@/types/Activity';

export interface ActivityListResponse {
  data: Activity[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const activityService = {
  /**
   * Get all activities with optional filters
   */
  async getActivities(
    params?: QueryActivityParams,
  ): Promise<ActivityListResponse> {
    const { data } = await api.get<ActivityListResponse>('/activities', {
      params,
    });
    return data;
  },

  /**
   * Get a single activity by ID
   */
  async getActivityById(id: number): Promise<Activity> {
    const { data } = await api.get<Activity>(`/activities/${id}`);
    return data;
  },

  /**
   * Create a new activity
   */
  async createActivity(dto: CreateActivityDto): Promise<Activity> {
    const { data } = await api.post<Activity>('/activities', dto);
    return data;
  },

  /**
   * Update an existing activity
   */
  async updateActivity(id: number, dto: UpdateActivityDto): Promise<Activity> {
    const { data } = await api.patch<Activity>(`/activities/${id}`, dto);
    return data;
  },

  /**
   * Delete an activity
   */
  async deleteActivity(id: number): Promise<void> {
    await api.delete(`/activities/${id}`);
  },

  /**
   * Get packages that include this activity
   */
  async getPackagesForActivity(id: number): Promise<any[]> {
    const { data } = await api.get(`/activities/${id}/packages`);
    return data;
  },
};
