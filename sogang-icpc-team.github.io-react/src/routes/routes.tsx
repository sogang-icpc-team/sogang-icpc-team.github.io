import { MainPage } from "../app/main-page/main-page";

type TRoute = {
  path: string;
  component: React.ReactNode;
};
export const routes: TRoute[] = [
  {
    path: "/",
    component: <MainPage />,
  },
];
