import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ההכרעה ההיסטורית" },
      { name: "description", content: "החדר הרביעי בחדר הבריחה ההיסטורי על הקמת מדינת ישראל - מיון טיעונים בעד ונגד הכרזת המדינה" },
      { property: "og:title", content: "ההכרעה ההיסטורית" },
      { name: "twitter:title", content: "ההכרעה ההיסטורית" },
      { property: "og:description", content: "החדר הרביעי בחדר הבריחה ההיסטורי על הקמת מדינת ישראל - מיון טיעונים בעד ונגד הכרזת המדינה" },
      { name: "twitter:description", content: "החדר הרביעי בחדר הבריחה ההיסטורי על הקמת מדינת ישראל - מיון טיעונים בעד ונגד הכרזת המדינה" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/635432bb-fdaf-4f2c-9b31-46ce40ec797f/id-preview-cd7efa72--ec8c062f-2c07-4649-a52a-79a81b306950.lovable.app-1777204442710.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/635432bb-fdaf-4f2c-9b31-46ce40ec797f/id-preview-cd7efa72--ec8c062f-2c07-4649-a52a-79a81b306950.lovable.app-1777204442710.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
