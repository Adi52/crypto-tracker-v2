const Layout = ({ children }) => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-700">
      {children}
    </main>
  );
};

export default Layout;
