import { App } from "@app/App";
import { BlockIdGuard } from "@app/guards/BlockIdGuard";
import { BlockPage } from "@pages/block";
import { BlocksPage } from "@pages/blocks";
import { HomePage } from "@pages/home";
import { StatsPage } from "@pages/stats";
import { routes } from "@shared/lib/routes";
import { createBrowserRouter } from "react-router";
import { AccountPage } from "@pages/account";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: routes.stats,
        element: <StatsPage />
      },
      {
        path: routes.blocks,
        element: <BlocksPage />
      },
      {
        path: routes.block,
        element: <BlockIdGuard />,
        children: [
          {
            index: true,
            element: <BlockPage />
          }
        ]
      },
      {
        path: routes.account,
        element: <AccountPage />
      }
    ]
  }
]);
