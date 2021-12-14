import Link from "next/link";

const Button = (props) => {
  const { customClassName, title, href } = props;
  const buttonClassName = `bg-white text-gray-700 p-2 font-montserrat rounded-md font-medium ${customClassName}`;

  const button = (
    <button {...props} className={buttonClassName}>
      {title}
    </button>
  );

  if (href) {
    return <Link href={href}>{button}</Link>;
  }

  return button;
};

export default Button;
