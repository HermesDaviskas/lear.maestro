type HeaderProps = {
  title: string;
  subtitle?: string;
};

export default function Header({ title, subtitle }: HeaderProps) {
  const title_html = <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>;

  const version_html = (
    <span className="text-sm font-mono text-gray-400">ver. {subtitle}</span>
  );

  return (
    <>
      <header className="bg-gray-900 text-white flex justify-between sticky px-4 py-2 top-0 z-50 h-18">
        <div className="max-w-5xl">
          {title_html}
          {subtitle && version_html}
        </div>
      </header>
    </>
  );
}
