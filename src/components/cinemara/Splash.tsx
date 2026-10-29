export default function Splash({ fading }: { fading: boolean }) {
  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-opacity duration-500 ${fading ? "opacity-0" : "opacity-100"}`}>
      <p className="text-4xl font-black tracking-tight text-[#27E9B5]">DEVXYZ</p>
      <p className="mt-2 text-sm text-neutral-500">Movie</p>
    </div>
  );
}
