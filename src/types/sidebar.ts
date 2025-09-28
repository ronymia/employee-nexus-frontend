export interface IMenuItems {
  Icon: React.ElementType;
  label: string;
  path: string;
  show?: boolean;
  subMenus?: IMenuItems[];
}
