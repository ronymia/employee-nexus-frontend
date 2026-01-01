import { IWorkSite } from "./work-sites.type";

export interface IEmployeeWorkSite {
  userId: number;
  workSiteId: number;
  workSite: IWorkSite;
}
