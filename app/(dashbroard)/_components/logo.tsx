import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href={`/`} className=" ">
      {/* <Image
        className=" bg-customDark"
        height={130}
        width={130}
        alt="logo"
        src="/logo.jpg"
      ></Image> */}

      <div className="flex items-center  justify-start ">
        <div className="  text-5xl flex tracking-tighter text-[#7633ff]  ">
          <span className="">{`{`}</span>
          <span className="  relative  text-[#4eeac6]  ">
            {`}`}
            <span className=" absolute -translate-y-5 -left-1">{`.`}</span>
          </span>
          <span className=" -translate-x-1">{`}`}</span>
        </div>
        <div className=" text-xl  flex flex-col items-center justify-between gap-y-0  ">
          <div className=" font-bold text-[#7633ff]">Academy</div>
          <div className="  font-serif text-[#7633ff]  text-sm">Runner</div>
        </div>
      </div>
    </Link>
  );
};

export default Logo;
