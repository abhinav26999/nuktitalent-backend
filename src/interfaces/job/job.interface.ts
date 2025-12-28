export interface CreateJobRequestBody {
  title: string;
  company: string;
  location: string;
  experience: string;
  salary: string;
  description: string;
}

export interface UpdateJobRequestBody {
  title?: string;
  company?: string;
  location?: string;
  experience?: string;
  salary?: string;
  description?: string;
}
