import Image from "next/image";
import React from "react";
import forkIcon from "@src/icons/code-fork-solid.svg";

export default function Header() {
    return (
        <div className="absolute right-0 top-0 p-3">
            <a
                href="https://github.com/Emam546/speech-recorder"
                className="hover:scale-125 transition-all duration-300 block"
            >
                <Image
                    src={forkIcon}
                    width={15}
                    height={15}
                    alt="Fork me on GitHub"
                    data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"
                />
            </a>
        </div>
    );
}
