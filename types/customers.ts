export type Customer = {
  id: number;
  profilepicture: string;
  firstname: string;
  lastname: string;
  email: string;
  lastLoggedIn: string;
  status: boolean;
  role: string;
};

export type CustomerQueryParameters = {
  sort?: string;
  limit?: number;
  offset?: number;
  search?: string;
  role?: string;
};