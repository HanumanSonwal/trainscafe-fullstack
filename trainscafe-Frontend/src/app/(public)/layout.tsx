export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Navbar */}
      <header className="border-b p-4">
        <h1 className="text-xl font-semibold">TrainsCafe</h1>
      </header>

      {/* Page Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t p-4 text-center">
        © 2026 TrainsCafe
      </footer>

    </div>
  );
}