export interface ActivitySchedule {
  id: number;
  activityId: number;
  timezone: string;
  daysOfWeek: Array<'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN'>;
  startTime: string;
  endTime?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityFeature {
  id: number;
  activityId: number;
  category?: string;
  iconUrl?: string;
  name: string;
  description?: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: number;
  name: string;
  description?: string;
  destinationCityId: number;
  createdAt: string;
  updatedAt: string;
  destinationCity?: {
    id: number;
    name: string;
    regionId: number;
    region: {
      id: number;
      name: string;
      stateId: number;
      state: {
        id: number;
        name: string;
        countryId: number;
      };
    };
  };
  schedules?: ActivitySchedule[];
  features?: ActivityFeature[];
  packages?: Array<{
    id: number;
    name: string;
    description: string;
    companyId: number;
  }>;
}

export interface CreateActivitySchedule {
  timezone: string;
  daysOfWeek: Array<'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN'>;
  startTime: string;
  endTime?: string;
  notes?: string;
}

export interface CreateActivityFeature {
  category?: string;
  iconUrl?: string;
  name: string;
  description?: string;
  order?: number;
}

export interface CreateActivityDto {
  name: string;
  description?: string;
  destinationCityId: number;
  schedules?: CreateActivitySchedule[];
  features?: CreateActivityFeature[];
}

export interface UpdateActivityDto {
  name?: string;
  description?: string;
  destinationCityId?: number;
  schedules?: CreateActivitySchedule[];
  features?: CreateActivityFeature[];
}

export interface QueryActivityParams {
  destinationCityId?: number;
  q?: string;
  page?: number;
  limit?: number;
}
