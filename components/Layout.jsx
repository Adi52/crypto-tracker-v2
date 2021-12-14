const Layout = ({ children }) => {
  return (
    <main
      className="flex flex-col items-center min-h-screen bg-gray-700"
      style={{ backgroundColor: "#212121" }}
    >
      {children}
    </main>
  );
};

export default Layout;
