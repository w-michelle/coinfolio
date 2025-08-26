interface Props {
  children: React.ReactNode;
}
const Layout = ({ children }: Props) => {
  return (
    <div className="bg-black min-h-svh flex flex-col items-center justify-center">
      <div className="rounded-md w-full max-w-sm md:max-w-md ">{children}</div>
    </div>
  );
};
export default Layout;
