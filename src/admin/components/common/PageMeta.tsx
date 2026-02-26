import React from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

interface PageMetaProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
}

const PageMeta: React.FC<PageMetaProps> = ({
  title,
  description,
  keywords,
  image,
}) => {
  const defaultDescription = "Admin Dashboard";
  const defaultImage = "/logo.png"; // change if needed

  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{title}</title>
      <meta
        name="description"
        content={description || defaultDescription}
      />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph (for social sharing) */}
      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        content={description || defaultDescription}
      />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:type" content="website" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta
        name="twitter:description"
        content={description || defaultDescription}
      />
      <meta name="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
};

/* Wrap your app with this in main.tsx or App.tsx */
export const AppWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <HelmetProvider>{children}</HelmetProvider>;
};

export default PageMeta;
