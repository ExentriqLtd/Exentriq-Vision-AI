import React from "react";

import type { NextPage } from "next";

interface HeaderInt {
  title: string;
  subtitle?: string;
  colorSubtitlePrimary?: boolean;
  collectionId?: string;
  paragraph?: boolean;
}
const Header: NextPage<HeaderInt> = ({ title, subtitle, colorSubtitlePrimary, collectionId, paragraph = true }: HeaderInt) => {
  return (
    <>
      <div className="max-w-2xl text-left">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{title}</h2>
        {colorSubtitlePrimary ? (
          <p className="mt-2 text-3xl leading-8 font-bold color-primary-ex">{subtitle}</p>
        ) : (
          <p className="mt-2 text-3xl leading-8 text-gray-600">{subtitle}</p>
        )}
        {paragraph && (
          <p className="my-10 text-md leading-8 text-gray-600">To start a new conversation with <b>Q</b> please {collectionId ? 'upload a document you want him to study.' : 'select a collection or create one'} </p>
        )}
      </div>
    </>
  );
};
export default Header;
