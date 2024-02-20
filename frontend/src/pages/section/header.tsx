import React from "react";

import type { NextPage } from "next";

interface HeaderInt {
  title?: string;
  subtitle?: string;
  colorSubtitlePrimary?: boolean;
  collectionId?: string;
  paragraph?: boolean;
}
const Header: NextPage<HeaderInt> = ({ title, subtitle, colorSubtitlePrimary, collectionId, paragraph = true }: HeaderInt) => {
  return (
    <>
      <div className="max-w-2xl text-left">
        {title && (
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{title}</h2>
        )}
        <p className={`${title ? 'mt-2' : 'my-4' } text-3xl leading-8 font-bold ${colorSubtitlePrimary ? 'color-primary-ex' : 'text-gray-600'}`}>{subtitle}</p>
        {paragraph && (
          <p className="my-10 text-md leading-8 text-gray-600">To start a new conversation please {collectionId ? 'upload a document you want him to study.' : 'select a collection or create one'} </p>
        )}
      </div>
    </>
  );
};
export default Header;
