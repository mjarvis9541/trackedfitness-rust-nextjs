import UserNavbar from "@/components/UserNavbar";

export default function UserLayout({
  params: { username },
  children,
}: {
  params: { username: string };
  children: React.ReactNode;
}) {
  return (
    <>
      <UserNavbar username={username} />
      {children}
    </>
  );
}
