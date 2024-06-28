import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

export default function RootLayout({
    children,
  }:{
    children: React.ReactNode;
  }) {
    return (
     <div className="h-[100vh]">
        <Navbar/>
        <div className="hidden md:flex flex-col fixed mt-[4.5rem] bg-secondary shadow-md rounded-t-none inset-y-0">
          <Sidebar />
        </div>
        <main className="md:pl-[6.5rem] pt-16 h-[100vh]">
         {children}
        </main>
     </div>
    );
  }