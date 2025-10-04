export default function GradientOrb() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 opacity-60"
      style={{
        background:
          "radial-gradient(800px 400px at 50% -10%, rgba(111,87,255,0.25), transparent 60%), radial-gradient(600px 300px at 90% 10%, rgba(0,224,255,0.18), transparent 60%), radial-gradient(600px 300px at 10% 20%, rgba(255,78,205,0.18), transparent 60%)"
      }}
    />
  );
}
