import { UserProvider } from "../hook/UserProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <UserProvider>{children}</UserProvider>;
}
