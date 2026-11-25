type MediumIconProps = {
  size?: number;
  className?: string;
};

export default function MediumIcon({ size = 22, className }: MediumIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      focusable="false"
    >
      <ellipse cx="6.2" cy="12" rx="4.3" ry="6.2" />
      <ellipse cx="15.3" cy="12" rx="2.3" ry="6.2" />
      <ellipse cx="21" cy="12" rx="1.1" ry="5.2" />
    </svg>
  );
}
